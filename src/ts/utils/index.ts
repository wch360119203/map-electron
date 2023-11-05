import dayjs from 'dayjs'
import { defineComponent, h, onMounted, ref } from 'vue'

/**
 * 高德的地图框架要求容器的position属性必须是absolute
 * 所以需要根据父容器创建一个与其同步变化的子容器
 **/
export function createFollowDiv(dom: HTMLDivElement) {
  const child = document.createElement('div')
  const setFn = () => {
    const rect = dom.getBoundingClientRect()
    child.style.position = 'absolute'
    child.style.width = rect.width + 'px'
    child.style.height = rect.height + 'px'
    child.style.top = rect.y + 'px'
    child.style.left = rect.x + 'px'
  }
  dom.appendChild(child)
  const resizeObs = new ResizeObserver(setFn)
  resizeObs.observe(dom)
  return child
}

export function createSvg(outerHtml: string) {
  const root = document.createElement('span')
  root.innerHTML = outerHtml
  const ret = root.children[0] as SVGElement | undefined
  if (ret === undefined) throw new Error('创建svg失败')
  return ret
}
export function createSvgCom(outerHtml: string) {
  const svg = createSvg(outerHtml)
  svg.classList.add('fill-container')
  return defineComponent(() => {
    const container = ref<HTMLElement>()
    onMounted(() => {
      container.value?.appendChild(svg)
    })
    return () => {
      return h('div', { ref: container })
    }
  })
}
/**返回文件的大小 */
export function formatFileSize(size: number): string {
  let rank = 0
  while (rank < 3 && size > 10240) {
    rank++
    size /= 1024
  }
  switch (rank) {
    case 0:
      return Math.ceil(size) + 'b'
    case 1:
      return Math.ceil(size) + 'k'
    case 2:
      return Math.ceil(size) + 'M'
    case 3:
      return size.toFixed(2) + 'G'
    default:
      return size.toString()
  }
}

/**excel时间到js时间的转换 */
export function excelTime2JsTime(excelTime: number) {
  return new Date(
    (excelTime - 25567) * 24 * 3600000 -
      5 * 60 * 1000 -
      43 * 1000 -
      24 * 3600000 -
      8 * 3600000,
  )
}
export function formatDate(date: Date) {
  return dayjs(date).format('YYYY/MM/DD')
}

/**获取最近的下一个周四 */
export function getNearlyThursday(inVal: number) {
  const inDate = dayjs(inVal)
  if (inDate.day() >= 4) {
    return inDate.add(7, 'd').day(4).valueOf()
  } else {
    return inDate.day(4).valueOf()
  }
}
