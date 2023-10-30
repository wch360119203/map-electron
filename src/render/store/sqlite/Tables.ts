import { bookRecords, acRecord, workParam, poi } from '.'

/**定义sqlite的表 */
declare module 'knex/types/tables' {
  interface Tables {
    book_records: bookRecords
    account_book: acRecord
    work_param: workParam
    poi: poi
  }
}
