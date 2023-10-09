import { BaseLayer } from '@antv/l7'
import { workParam } from '@/render/store'

type filterParams = Parameters<BaseLayer['filter']>
/**筛选运营商 */
export function filterByOperator(name: RegExp): filterParams {
  return ['wp', (field: workParam) => name.test(field.operator)]
}
