import { acRecord, baseRecord } from '@/render/store'
import { AccountBook } from '@/render/store'
export function accountBookWrite(
  json: Record<string, any>[],
  fieldDict: Record<OmitKey<acRecord, baseRecord>, string>,
) {
  AccountBook.instance.db.update
}
