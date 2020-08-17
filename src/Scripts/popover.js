// import { render, unmountComponentAtNode } from 'react-dom'
import Popper from 'popper.js'

const MODAL_ROOT_ID = 'modal-root'


function getTransitionDuration(node, recursive = false) {
  const durations = getComputedStyle(node).transitionDuration
    .split(',').map(s => parseFloat(s))
  let duration = Math.max(...durations)

  if (duration === 0 && recursive) {
    duration = Math.max(
      0, ...[...node.children].map(node => getTransitionDuration(node))
    )
  }
  return duration
}

export function startCSSTransition(node, state, callback) {
  const onTransitionEnd = function() {
    node.removeEventListener('transitionend', onTransitionEnd)
    if (callback)
      callback()
  }
  node.dataset.transitionState = state + 'ing'
  node.scrollTop  // eslint-disable-line no-unused-expressions
  node.dataset.transitionState = state
  
  const duration = getTransitionDuration(node, true)
  if (duration > 0) {
    node.addEventListener('transitionend', onTransitionEnd)
  } else {
    onTransitionEnd()
  }
}


const refs = []  // keeps reference of open popovers

export function openPopover(contentFn, target, { transitionName = 'popover', placement = 'auto' } = {}) {
  const existing = refs.find(ref => ref.target === target) 
  if (existing) {
    existing.popover.close()
    return
  }
  
  let popper = null
  const root = document.getElementById(MODAL_ROOT_ID)
  const container = document.createElement('div')
  container.className = 'popover-container'
  if (transitionName)
    container.dataset.transitionName = transitionName
  root.appendChild(container)

  const onDocumentClick = function(e) {
    if (e.target !== container && !container.contains(e.target))
      close()
  }

  const close = function() {
    startCSSTransition(container, 'exit', () => {
      document.removeEventListener('click', onDocumentClick)
      unmountComponentAtNode(container)
      container.remove()
      popper.destroy()
      
      const ref = refs.filter(ref => ref.popover.close !== close)
      if (ref)
        refs.splice(refs.indexOf(ref), 1)        
    })
  }

  render(contentFn({ close }), container, () => {
    popper = new Popper(target, container, { placement })
    document.addEventListener('click', onDocumentClick)
    startCSSTransition(container, 'enter')
  })

  const popover = { close }
  refs.push({ target, popover })
  
  return popover
}