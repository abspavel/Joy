const fs = require('fs');
let code = fs.readFileSync('src/components/originkit/ui/magnetic-hover-button.tsx', 'utf8');

const start = code.indexOf('export default function MagneticButton');
if (start !== -1) {
  code = code.substring(0, start) + `export default function MagneticButton({
  label,
  children,
  link = "",
  newTab = false,
  font,
  fill = "transparent",
  textColor = "var(--text-primary)",
  sweepColor = "var(--text-primary)",
  sweepTextColor = "var(--bg-primary)",
  paddingX,
  paddingY,
  radius = 9999,
  magnet = 8,
  transition = {},
  border = true,
  borderOptions = { color: "var(--text-primary)", width: 1 },
  style,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, d: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hoverRef = useRef(false);

  const borderColor = borderOptions?.color ?? "var(--text-primary)";
  const borderWidth = border ? borderOptions?.width ?? 1 : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const pull = (magnet / 20) * MAX_PULL;
    const reach = magnet * RANGE_PER_POINT;

    function onMove(event) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - pos.x;
      const cy = rect.top + rect.height / 2 - pos.y;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      const edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
      const edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
      const gap = Math.hypot(edgeX, edgeY);

      if (inside !== hoverRef.current) {
        const lx = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const ly = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
        const d = 2.4 * Math.hypot(rect.width, rect.height);
        setOrigin({ x: lx, y: ly, d });
        hoverRef.current = inside;
        setHover(inside);
      }

      if (gap > reach) {
        setPos({ x: 0, y: 0 });
        return;
      }

      const falloff = reach === 0 ? 0 : 1 - gap / reach;
      setPos({ x: dx * pull * falloff, y: dy * pull * falloff });
    }

    function onLeave() {
      setPos({ x: 0, y: 0 });
      hoverRef.current = false;
      setHover(false);
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [magnet, pos]);

  const paddingStyle =
    paddingX !== undefined || paddingY !== undefined
      ? { padding: \`\$\{paddingY ?? 0\}px \$\{paddingX ?? 0\}px\` }
      : {};

  return (
    <a
      ref={ref}
      href={link || undefined}
      target={link && newTab ? "_blank" : undefined}
      rel={link && newTab ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={\`relative inline-flex items-center justify-center box-border cursor-pointer select-none overflow-hidden no-underline whitespace-nowrap will-change-transform \$\{className\}\`}
      style={{
        ...paddingStyle,
        borderRadius: radius,
        background: fill,
        border: borderWidth > 0 ? \`\$\{borderWidth\}px solid \$\{borderColor\}\` : "none",
        transform: \`translate3d(\$\{pos.x\}px, \$\{pos.y\}px, 0)\`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        ...font,
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: origin.y,
          left: origin.x,
          width: origin.d,
          height: origin.d,
          marginLeft: -origin.d / 2,
          marginTop: -origin.d / 2,
          borderRadius: "50%",
          background: sweepColor,
          transformOrigin: "center",
          pointerEvents: "none",
          transform: hover ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      />
      <span
        style={{ 
          position: "relative", 
          zIndex: 1, 
          color: hover ? sweepTextColor : textColor,
          transition: 'color 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        className="flex items-center justify-center font-medium uppercase tracking-wider"
      >
        {children || label}
      </span>
    </a>
  );
}
`;
  fs.writeFileSync('src/components/originkit/ui/magnetic-hover-button.tsx', code);
}
