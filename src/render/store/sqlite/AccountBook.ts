import { acRecord, baseRecord } from '@/render/store'
import { db } from '../DB'
export function writeAccountBook(records: acRecord[]) {}
export class AccountBook {
  static instance = new AccountBook()
  db
  private constructor() {
    this.db = db<acRecord>('account_book')
  }
  write() {
    
  }
}
