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
