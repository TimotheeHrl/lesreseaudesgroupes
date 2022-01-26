import { BaseModule } from './BaseModule'

export class AltAttribute extends BaseModule {
  onCreate = () => {
    // Create the container to hold the input element
    this.display = document.createElement('div')

    // Apply styles
    Object.assign(this.display.style, this.options.displayStyles)

    // Attach it
    this.overlay.appendChild(this.display)

    // ALT input
    this.altInput = document.createElement('input')
    if (this.img.alt) {
      // Set default value into the input
      this.altInput.value = this.img.alt
    }
    this.altInput.addEventListener('input', this.onAltInputChange)

    this.display.insertAdjacentHTML('beforeend', 'Alt: ')
    this.display.appendChild(this.altInput)
  }

  onAltInputChange = (e) => {
    this.img.alt = e.target.value
    this.img.title = e.target.value
  }

  onDestroy = () => {
    this.altInput.removeEventListener('input', this.onAltInputChange)
  }

  onUpdate = () => {
    if (!this.display || !this.img) {
      return
    }

    Object.assign(this.display.style, {
      right: 'auto',
      bottom: '-40px',
      left: '8px',
      'min-width': '172px',
    })
  }

  getCurrentSize = () => [
    this.img.width,
    Math.round(
      (this.img.width / this.img.naturalWidth) * this.img.naturalHeight
    ),
  ]
}
