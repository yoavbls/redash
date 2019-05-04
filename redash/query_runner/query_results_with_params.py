import json
import logging
import re
import sqlite3
import uuid

import pystache
import sqlparse

from redash.query_runner import TYPE_STRING, guess_type, register
from redash.query_runner.query_results import Results, _load_query, create_table
from redash.utils import json_dumps

logger = logging.getLogger(__name__)


def extract_child_queries(query):
    pattern = re.compile(r"^query_(\d+)(?:\('({.+})'\))?", re.IGNORECASE)
    stmt = sqlparse.parse(query)[0]

    function_tokens = collect_function_tokens(stmt, [])

    queries = []
    for token in function_tokens:
        m = pattern.match(token.value)
        if not m:
            continue

        table_name = 'tmp_{}'.format(str(uuid.uuid4()).replace('-', '_'))

        queries.append({
            'query_id': int(m.group(1)),
            'params': {} if m.group(2) is None else json.loads(m.group(2)),
            'table': table_name,
            'token': token.tokens[0].value if isinstance(token.tokens[0], sqlparse.sql.Function) else token.value,
        })

    return queries


def collect_function_tokens(_token, _function_tokens):
    if _token.is_group:
        for t in _token.tokens:
            _function_tokens = collect_function_tokens(t, _function_tokens)

    if isinstance(_token, sqlparse.sql.Function):
        _function_tokens.append(_token)

    return _function_tokens


def create_tables_from_child_queries(user, connection, query, child_queries):
    for child_query in child_queries:
        _query = _load_query(user, child_query['query_id'])

        params = child_query.get('params', get_default_params(_query))

        query_with_params = pystache.render(_query.query_text, params)
        results, error = _query.data_source.query_runner.run_query(query_with_params, user)

        if error:
            raise Exception('Failed loading results for query id {}.'.format(_query.id))

        results = json.loads(results)
        table_name = child_query['table']
        create_table(connection, table_name, results)
        query = query.replace(child_query['token'], table_name, 1)

    return query


def get_default_params(query):
    params = {}

    if 'parameters' not in query.options:
        return params

    for p in query.options['parameters']:
        params[p['name']] = p['value']

    return params


class ResultsWithParams(Results):
    @classmethod
    def name(cls):
        return 'Query Results with parameters(PoC)'

    def run_query(self, query, user):
        child_queries = extract_child_queries(query)

        connection = None
        cursor = None
        json_data = None
        error = None

        try:
            connection = sqlite3.connect(':memory:')
            query = create_tables_from_child_queries(user, connection, query, child_queries)

            cursor = connection.cursor()
            cursor.execute(query)

            if cursor.description is None:
                error = 'Query completed but it returned no data.'
            else:
                columns = self.fetch_columns([(i[0], None) for i in cursor.description])
                column_names = [c['name'] for c in columns]

                rows = []
                logger.info(columns)
                for i, row in enumerate(cursor):
                    if i == 0:
                        for j, col in enumerate(row):
                            guess = guess_type(col)

                            if columns[j]['type'] is None:
                                columns[j]['type'] = guess
                            elif columns[j]['type'] != guess:
                                columns[j]['type'] = TYPE_STRING

                    rows.append(dict(zip(column_names, row)))

                json_data = json_dumps({
                    'columns': columns,
                    'rows': rows,
                })
        except KeyboardInterrupt:
            if connection:
                connection.interrupt()
            error = 'Query cancelled by user.'
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

        return json_data, error


register(ResultsWithParams)
