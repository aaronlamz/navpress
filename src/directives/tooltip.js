/**
 * v-tooltip 指令：动画气泡提示
 * - 默认只在文字被省略(truncate)时才提示；加 .always 修饰符则始终提示
 * - 气泡挂到 <body>，避免被侧边栏等 overflow 容器裁切
 * 用法：v-tooltip="文本"  /  v-tooltip.always="文本"
 */
let tipEl = null
let hideTimer = null

function ensureTipEl() {
  if (tipEl) return tipEl
  tipEl = document.createElement('div')
  tipEl.className = 'np-tooltip'
  document.body.appendChild(tipEl)
  return tipEl
}

function isTruncated(el) {
  return el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
}

function showTip(target, text) {
  if (!text) return
  const el = ensureTipEl()
  el.textContent = text
  el.classList.add('np-tooltip--visible')
  // 内容渲染后再定位
  requestAnimationFrame(() => {
    const r = target.getBoundingClientRect()
    const tw = el.offsetWidth
    const th = el.offsetHeight
    let left = r.left + r.width / 2 - tw / 2
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8))
    let top = r.bottom + 8
    if (top + th > window.innerHeight - 8) {
      top = r.top - th - 8 // 下方放不下则放上方
    }
    el.style.left = `${Math.round(left)}px`
    el.style.top = `${Math.round(top)}px`
  })
}

function hideTip() {
  if (tipEl) tipEl.classList.remove('np-tooltip--visible')
}

export default {
  mounted(el, binding) {
    el._tipText = binding.value
    el._tipEnter = () => {
      if (!binding.modifiers.always && !isTruncated(el)) return
      clearTimeout(hideTimer)
      showTip(el, el._tipText != null ? String(el._tipText) : el.textContent.trim())
    }
    el._tipLeave = () => {
      hideTimer = setTimeout(hideTip, 80)
    }
    el.addEventListener('mouseenter', el._tipEnter)
    el.addEventListener('mouseleave', el._tipLeave)
    // 去掉原生 title，避免双重提示
    if (el.getAttribute && el.getAttribute('title')) el.removeAttribute('title')
  },
  updated(el, binding) {
    el._tipText = binding.value
  },
  beforeUnmount(el) {
    if (el._tipEnter) el.removeEventListener('mouseenter', el._tipEnter)
    if (el._tipLeave) el.removeEventListener('mouseleave', el._tipLeave)
    hideTip()
  },
}
