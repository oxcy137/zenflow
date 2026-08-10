export PATH="$HOME/.local/bin:$PATH"

## Card Shimmer Effect (working)
Backdrop-filter brightness sweep via mask-position animation:
```css
.card-shimmer-overlay::after {
  width: 200%; height: 200%; top: -50%; left: -50%;
  backdrop-filter: brightness(2);
  mask-image: linear-gradient(90deg, transparent 38%, black 46%, black 54%, transparent 62%);
  mask-size: 200% 100%;
  transform: rotate(-25deg);
}
@keyframes card-shimmer-sweep {
  0% { mask-position: 100% 0; }
  100% { mask-position: -100% 0; }
}
```
Direction: left-to-right sweep, rotated for diagonal appearance (bottom-left→top-right).
