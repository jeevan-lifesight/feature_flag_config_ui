import React, { useState } from "react";

/* ------------------ TYPES ------------------ */

type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type ColorScheme =
  | "light"
  | "dark"
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "error";

type BackgroundToken =
  | "surface"
  | "surface-alt"
  | "muted"
  | "brand"
  | "transparent"
  | "gradient"
  | "inset";

type AccentToken =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand"
  | "neutral";

type TextVariant =
  | "display"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "eyebrow"
  | "code";

type TextColorToken =
  | "default"
  | "muted"
  | "danger"
  | "warning"
  | "success"
  | "primary";

type LayoutType =
  | "stacked"
  | "centered-card"
  | "split-left-text-right-media"
  | "split-right-text-left-media"
  | "banner-top"
  | "banner-bottom"
  | "side-panel"
  | "modal";

type SectionType = "text" | "hero" | "image";

type CTAPriority = "primary" | "secondary" | "tertiary" | "danger" | "ghost";
type CTAKind = "button" | "link" | "icon-button";
type CTASize = "sm" | "md" | "lg";

interface TextStyle {
  color?: TextColorToken;
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "right" | "center" | "justify";
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  maxLines?: number;
  spacingTop?: SpacingToken;
  spacingBottom?: SpacingToken;
}

interface TextBlock {
  id: string;
  variant: TextVariant;
  text: string;
  style?: TextStyle;
}

interface VisibilityConfig {
  platforms?: ("web" | "ios" | "android")[];
  minWidthPx?: number;
  maxWidthPx?: number;
}

interface SectionBase {
  id: string;
  type: SectionType;
  width?: "auto" | "full" | "1/2" | "1/3" | "2/3";
  align?: "left" | "right" | "center";
  order?: number;
  padding?: SpacingToken;
  margin?: SpacingToken;
  visibility?: VisibilityConfig;
}

interface ImageSection extends SectionBase {
  type: "image";
  src?: string;
  alt?: string;
}

interface TextSection extends SectionBase {
  type: "text" | "hero";
  blocks: TextBlock[];
  ctas?: CTAConfig[];
}

type Section = TextSection | ImageSection;

type CtaAction =
  | { type: "route"; target: string; method?: "push" | "replace" }
  | { type: "external_url"; url: string; openInNewTab?: boolean }
  | { type: "mailto"; email: string; subject?: string; body?: string }
  | { type: "phone"; number: string }
  | { type: "download"; fileUrl: string; fileName?: string }
  | { type: "copy_to_clipboard"; text: string; toastMessage?: string }
  | { type: "custom"; handlerId: string; payload?: Record<string, unknown> }
  | { type: "noop" };

interface CTAConfig {
  id: string;
  label: string;
  kind: CTAKind;
  priority: CTAPriority;
  size?: CTASize;
  icon?: string;
  action: CtaAction;
}

interface ScreenTheme {
  colorScheme?: ColorScheme;
  background?: BackgroundToken;
  accent?: AccentToken;
}

interface ScreenConfig {
  id: string;
  version: number;
  layout: LayoutType;
  theme?: ScreenTheme;
  sections: Section[];
  ctas?: CTAConfig[]; // global CTAs
}

/* ------------------ TOKENS / HELPERS ------------------ */

const spacingMap: Record<SpacingToken, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48
};

const textVariantStyles: Record<TextVariant, React.CSSProperties> = {
  display: { fontSize: 32, fontWeight: 600 },
  heading1: { fontSize: 28, fontWeight: 600 },
  heading2: { fontSize: 24, fontWeight: 600 },
  heading3: { fontSize: 20, fontWeight: 600 },
  heading4: { fontSize: 18, fontWeight: 600 },
  subtitle1: { fontSize: 16, fontWeight: 500 },
  subtitle2: { fontSize: 14, fontWeight: 500 },
  body1: { fontSize: 16 },
  body2: { fontSize: 14 },
  caption: { fontSize: 12 },
  eyebrow: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5
  },
  code: { fontSize: 13, fontFamily: "monospace" }
};

const textColorMap: Record<TextColorToken, string> = {
  default: "#111827",
  muted: "#6B7280",
  danger: "#DC2626",
  warning: "#D97706",
  success: "#16A34A",
  primary: "#2563EB"
};

const colorSchemeBackground: Record<ColorScheme, string> = {
  light: "#F9FAFB",
  dark: "#020617",
  brand: "#F5F3FF",
  neutral: "#F3F4F6",
  success: "#ECFDF3",
  warning: "#FFFBEB",
  error: "#FEF2F2"
};

const backgroundTokenMap: Record<BackgroundToken, string> = {
  surface: "#FFFFFF",
  "surface-alt": "#F3F4F6",
  muted: "#E5E7EB",
  brand: "#EEF2FF",
  transparent: "transparent",
  gradient:
    "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))",
  inset: "#F9FAFB"
};

const accentColorMap: Record<AccentToken, string> = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#0EA5E9",
  brand: "#4C1D95",
  neutral: "#6B7280"
};

/* ------------------ RENDERER ------------------ */

const CtaButton: React.FC<{ cta: CTAConfig }> = ({ cta }) => {
  const handleClick = () => {
    const a = cta.action;
    switch (a.type) {
      case "route":
        alert(`Route to: ${a.target}`);
        break;
      case "external_url":
        window.open(a.url, a.openInNewTab ? "_blank" : "_self");
        break;
      case "mailto": {
        const params = new URLSearchParams();
        if (a.subject) params.set("subject", a.subject);
        if (a.body) params.set("body", a.body);
        window.location.href = `mailto:${a.email}?${params.toString()}`;
        break;
      }
      case "phone":
        window.location.href = `tel:${a.number}`;
        break;
      case "download":
        window.open(a.fileUrl, "_blank");
        break;
      case "copy_to_clipboard":
        navigator.clipboard.writeText(a.text).catch(() => {});
        if (a.toastMessage) alert(a.toastMessage);
        break;
      case "custom":
        alert(`Custom handler: ${a.handlerId}`);
        break;
      case "noop":
      default:
        break;
    }
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: 999,
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  };

  const sizeStyle: Record<CTASize, React.CSSProperties> = {
    sm: { padding: "4px 10px" },
    md: { padding: "6px 14px" },
    lg: { padding: "8px 18px" }
  };

  const priorityStyle: Record<CTAPriority, React.CSSProperties> = {
    primary: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      borderColor: "#2563EB"
    },
    secondary: {
      backgroundColor: "#FFFFFF",
      color: "#111827",
      borderColor: "#D1D5DB"
    },
    tertiary: {
      backgroundColor: "transparent",
      color: "#2563EB",
      borderColor: "transparent"
    },
    danger: {
      backgroundColor: "#DC2626",
      color: "#FFFFFF",
      borderColor: "#DC2626"
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#111827",
      borderColor: "#D1D5DB"
    }
  };

  const size = cta.size ?? "md";

  if (cta.kind === "link") {
    return (
      <button
        style={{
          ...baseStyle,
          ...sizeStyle[size],
          ...priorityStyle[cta.priority],
          backgroundColor: "transparent",
          border: "none",
          color:
            cta.priority === "primary" ? "#2563EB" : "#2563EB",
          textDecoration: "underline"
        }}
        onClick={handleClick}
      >
        {cta.label}
      </button>
    );
  }

  return (
    <button
      style={{ ...baseStyle, ...sizeStyle[size], ...priorityStyle[cta.priority] }}
      onClick={handleClick}
    >
      {cta.label}
    </button>
  );
};

const TextBlockView: React.FC<{ block: TextBlock }> = ({ block }) => {
  const variantStyle = textVariantStyles[block.variant];
  const style: React.CSSProperties = { ...variantStyle };

  if (block.style) {
    const s = block.style;
    if (s.color) style.color = textColorMap[s.color];
    if (s.weight === "medium") style.fontWeight = 500;
    if (s.weight === "semibold") style.fontWeight = 600;
    if (s.weight === "bold") style.fontWeight = 700;
    if (s.align) style.textAlign = s.align;
    if (s.transform && s.transform !== "none")
      style.textTransform = s.transform;
    if (s.spacingTop)
      style.marginTop = spacingMap[s.spacingTop];
    if (s.spacingBottom)
      style.marginBottom = spacingMap[s.spacingBottom];
    if (s.maxLines && s.maxLines > 0) {
      style.display = "-webkit-box";
      // @ts-ignore
      style.WebkitBoxOrient = "vertical";
      // @ts-ignore
      style.WebkitLineClamp = s.maxLines;
      style.overflow = "hidden";
    }
  }

  return <div style={style}>{block.text}</div>;
};

const SectionView: React.FC<{ section: Section }> = ({ section }) => {
  const widthStyle: React.CSSProperties =
    section.width === "1/2"
      ? { flex: 1 }
      : section.width === "1/3"
      ? { flex: 1 }
      : section.width === "2/3"
      ? { flex: 2 }
      : { width: "100%" };

  const padding = section.padding
    ? spacingMap[section.padding]
    : 0;
  const margin = section.margin ? spacingMap[section.margin] : 0;

  const alignStyle: React.CSSProperties =
    section.align === "center"
      ? { textAlign: "center", alignItems: "center" }
      : section.align === "right"
      ? { textAlign: "right", alignItems: "flex-end" }
      : { textAlign: "left", alignItems: "flex-start" };

  const baseSectionStyle: React.CSSProperties = {
    ...widthStyle,
    padding,
    margin,
    display: "flex",
    flexDirection: "column",
    gap: 8
  };

  if (section.type === "image") {
    const imgSec = section as ImageSection;
    return (
      <div style={{ ...baseSectionStyle, ...alignStyle }}>
        {imgSec.src ? (
          <img
            src={imgSec.src}
            alt={imgSec.alt ?? ""}
            style={{
              maxWidth: "100%",
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 200,
              borderRadius: 16,
              border: "1px dashed #D1D5DB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF"
            }}
          >
            Image placeholder
          </div>
        )}
      </div>
    );
  }

  const textSec = section as TextSection;

  return (
    <div style={{ ...baseSectionStyle, ...alignStyle }}>
      {textSec.blocks.map((b) => (
        <TextBlockView key={b.id} block={b} />
      ))}
      {textSec.ctas && textSec.ctas.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 8
          }}
        >
          {textSec.ctas.map((c) => (
            <CtaButton key={c.id} cta={c} />
          ))}
        </div>
      )}
    </div>
  );
};

const DynamicScreen: React.FC<{ screen: ScreenConfig }> = ({ screen }) => {
  const theme = screen.theme ?? {};
  const colorScheme = theme.colorScheme ?? "light";
  const backgroundToken = theme.background ?? "surface";
  const accent = theme.accent ?? "primary";

  const outerBg = colorSchemeBackground[colorScheme];
  const innerBg = backgroundTokenMap[backgroundToken];
  const accentColor = accentColorMap[accent];

  const layout = screen.layout;

  const rootStyle: React.CSSProperties = {
    background: outerBg,
    minHeight: "100vh",
    padding: 16,
    boxSizing: "border-box"
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 900,
    margin: "0 auto",
    background: backgroundToken === "gradient" ? innerBg : innerBg,
    borderRadius: backgroundToken === "inset" ? 12 : 24,
    padding: 24,
    boxShadow:
      backgroundToken === "transparent"
        ? "none"
        : "0 18px 45px rgba(15,23,42,0.12)",
    boxSizing: "border-box"
  };

  // How sections are laid out inside the card
  const layoutStyle: React.CSSProperties =
    layout === "stacked" || layout === "centered-card"
      ? {
          display: "flex",
          flexDirection: "column",
          gap: 16
        }
      : layout === "split-left-text-right-media" ||
        layout === "split-right-text-left-media"
      ? {
          display: "flex",
          flexDirection:
            layout === "split-left-text-right-media" ? "row" : "row-reverse",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap"
        }
      : layout === "banner-top" || layout === "banner-bottom"
      ? {
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "center"
        }
      : layout === "side-panel"
      ? {
          display: "flex",
          flexDirection: "row",
          gap: 16
        }
      : layout === "modal"
      ? {
          display: "flex",
          flexDirection: "column",
          gap: 16
        }
      : {};

  // For modal layout we want the card centered in the viewport
  const modalWrapperStyle: React.CSSProperties =
    layout === "modal"
      ? {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh"
        }
      : {};

  return (
    <div style={rootStyle}>
      <div style={modalWrapperStyle}>
        <div style={cardStyle}>
          {/* Small label bar at top */}
          <div
            style={{
              borderLeft: `3px solid ${accentColor}`,
              paddingLeft: 8,
              marginBottom: 8
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1.4,
                color: "#6B7280"
              }}
            >
              Screen: {screen.id} · Layout: {screen.layout}
            </div>
          </div>

          {/* Sections laid out according to layoutStyle */}
          <div style={layoutStyle}>
            {screen.sections
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((s) => (
                <SectionView key={s.id} section={s} />
              ))}
          </div>

          {/* Global CTAs */}
          {screen.ctas && screen.ctas.length > 0 && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                flexWrap: "wrap"
              }}
            >
              {screen.ctas.map((c) => (
                <CtaButton key={c.id} cta={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ------------------ EDITOR UI ------------------ */

const spacingOptions: SpacingToken[] = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl"
];

const layoutOptions: LayoutType[] = [
  "stacked",
  "centered-card",
  "split-left-text-right-media",
  "split-right-text-left-media",
  "banner-top",
  "banner-bottom",
  "side-panel",
  "modal"
];

const colorSchemeOptions: ColorScheme[] = [
  "light",
  "dark",
  "brand",
  "neutral",
  "success",
  "warning",
  "error"
];

const backgroundOptions: BackgroundToken[] = [
  "surface",
  "surface-alt",
  "muted",
  "brand",
  "transparent",
  "gradient",
  "inset"
];

const accentOptions: AccentToken[] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "brand",
  "neutral"
];

const textVariantOptions: TextVariant[] = [
  "display",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "subtitle1",
  "subtitle2",
  "body1",
  "body2",
  "caption",
  "eyebrow",
  "code"
];

const textColorOptions: TextColorToken[] = [
  "default",
  "muted",
  "danger",
  "warning",
  "success",
  "primary"
];

const ctaPriorityOptions: CTAPriority[] = [
  "primary",
  "secondary",
  "tertiary",
  "danger",
  "ghost"
];

const ctaKindOptions: CTAKind[] = [
  "button",
  "link",
  "icon-button"
];

const ctaSizeOptions: CTASize[] = ["sm", "md", "lg"];

const sectionTypeOptions: SectionType[] = [
  "text",
  "hero",
  "image"
];

const widthOptions: Array<SectionBase["width"]> = [
  "auto",
  "full",
  "1/2",
  "1/3",
  "2/3"
];

const alignOptions: Array<SectionBase["align"]> = [
  "left",
  "center",
  "right"
];

type Platform = "web" | "ios" | "android";

const platformOptions: Platform[] = ["web", "ios", "android"];


const actionTypeOptions: CtaAction["type"][] = [
  "route",
  "external_url",
  "mailto",
  "phone",
  "download",
  "copy_to_clipboard",
  "custom",
  "noop"
];

/* ---- CTA Editor component ---- */

interface CtaEditorProps {
  cta: CTAConfig;
  onChange: (cta: CTAConfig) => void;
  onRemove: () => void;
}

const CtaEditor: React.FC<CtaEditorProps> = ({
  cta,
  onChange,
  onRemove
}) => {
  const update = (patch: Partial<CTAConfig>) =>
    onChange({ ...cta, ...patch });

  const updateAction = (patch: Partial<CtaAction>) =>
    onChange({ ...cta, action: { ...cta.action, ...patch } as CtaAction });

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 8,
        marginTop: 6
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4
        }}
      >
        <strong>CTA: {cta.id}</strong>
        <button
          style={{
            border: "none",
            background: "transparent",
            color: "#DC2626",
            cursor: "pointer",
            fontSize: 12
          }}
          onClick={onRemove}
        >
          ✕ Remove
        </button>
      </div>
      <label style={{ fontSize: 12 }}>Label</label>
      <input
        value={cta.label}
        onChange={(e) => update({ label: e.target.value })}
        style={{ width: "100%", fontSize: 12, padding: 4, marginBottom: 4 }}
      />

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 4
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Kind</label>
          <select
            value={cta.kind}
            onChange={(e) =>
              update({ kind: e.target.value as CTAKind })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {ctaKindOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Priority</label>
          <select
            value={cta.priority}
            onChange={(e) =>
              update({ priority: e.target.value as CTAPriority })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {ctaPriorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Size</label>
          <select
            value={cta.size ?? "md"}
            onChange={(e) =>
              update({ size: e.target.value as CTASize })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {ctaSizeOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label style={{ fontSize: 12 }}>Action type</label>
      <select
        value={cta.action.type}
        onChange={(e) =>
          update({
            action: { type: e.target.value as CtaAction["type"] } as CtaAction
          })
        }
        style={{ width: "100%", fontSize: 12, padding: 4, marginBottom: 4 }}
      >
        {actionTypeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Action-specific fields */}
      {cta.action.type === "route" && (
        <>
          <label style={{ fontSize: 12 }}>Target route</label>
          <input
            value={cta.action.target ?? ""}
            onChange={(e) =>
              updateAction({ target: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}

      {cta.action.type === "external_url" && (
        <>
          <label style={{ fontSize: 12 }}>URL</label>
          <input
            value={cta.action.url ?? ""}
            onChange={(e) =>
              updateAction({ url: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}

      {cta.action.type === "mailto" && (
        <>
          <label style={{ fontSize: 12 }}>Email</label>
          <input
            value={cta.action.email ?? ""}
            onChange={(e) =>
              updateAction({ email: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
          <label style={{ fontSize: 12 }}>Subject</label>
          <input
            value={cta.action.subject ?? ""}
            onChange={(e) =>
              updateAction({ subject: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}

      {cta.action.type === "phone" && (
        <>
          <label style={{ fontSize: 12 }}>Phone number</label>
          <input
            value={cta.action.number ?? ""}
            onChange={(e) =>
              updateAction({ number: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}

      {cta.action.type === "download" && (
        <>
          <label style={{ fontSize: 12 }}>File URL</label>
          <input
            value={cta.action.fileUrl ?? ""}
            onChange={(e) =>
              updateAction({ fileUrl: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}

      {cta.action.type === "copy_to_clipboard" && (
        <>
          <label style={{ fontSize: 12 }}>Text</label>
          <input
            value={cta.action.text ?? ""}
            onChange={(e) =>
              updateAction({ text: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}

      {cta.action.type === "custom" && (
        <>
          <label style={{ fontSize: 12 }}>Handler ID</label>
          <input
            value={cta.action.handlerId ?? ""}
            onChange={(e) =>
              updateAction({ handlerId: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </>
      )}
    </div>
  );
};

/* ---- Section editor ---- */

interface SectionEditorProps {
  section: Section;
  onChange: (section: Section) => void;
  onRemove: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onChange,
  onRemove
}) => {
  const update = (patch: Partial<Section>) =>
    onChange({ ...(section as Section), ...(patch as Section) } as Section);


  const isText = section.type === "text" || section.type === "hero";

  const updateVisibility = (patch: Partial<VisibilityConfig>) => {
    const next: VisibilityConfig = {
      ...(section.visibility ?? {}),
      ...patch
    };
    update({ visibility: next } as Section);
  };

  return (
    <div
      style={{
        border: "1px solid #D1D5DB",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4
        }}
      >
        <strong>Section: {section.id}</strong>
        <button
          style={{
            border: "none",
            background: "transparent",
            color: "#DC2626",
            cursor: "pointer",
            fontSize: 12
          }}
          onClick={onRemove}
        >
          ✕ Remove
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 4
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Type</label>
          <select
            value={section.type}
            onChange={(e) =>
              update({ type: e.target.value as SectionType })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {sectionTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Width</label>
          <select
            value={section.width ?? "auto"}
            onChange={(e) =>
              update({ width: e.target.value as SectionBase["width"] })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {widthOptions.map((w) => (
              <option key={w ?? "auto"} value={w ?? "auto"}>
                {w ?? "auto"}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Align</label>
          <select
            value={section.align ?? "left"}
            onChange={(e) =>
              update({ align: e.target.value as SectionBase["align"] })
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {alignOptions.map((a) => (
              <option key={a ?? "left"} value={a ?? "left"}>
                {a ?? "left"}
              </option>
            ))}
          </select>
        </div>
        <div style={{ width: 60 }}>
          <label style={{ fontSize: 12 }}>Order</label>
          <input
            type="number"
            value={section.order ?? 0}
            onChange={(e) =>
              update({ order: parseInt(e.target.value || "0", 10) } as Section)
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 4
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Padding</label>
          <select
            value={section.padding ?? "none"}
            onChange={(e) =>
              update({
                padding: e.target.value as SpacingToken
              } as Section)
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {spacingOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Margin</label>
          <select
            value={section.margin ?? "none"}
            onChange={(e) =>
              update({
                margin: e.target.value as SpacingToken
              } as Section)
            }
            style={{ width: "100%", fontSize: 12, padding: 4 }}
          >
            {spacingOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visibility controls */}
      <details style={{ marginBottom: 6 }}>
        <summary style={{ fontSize: 12, cursor: "pointer" }}>
          Visibility
        </summary>
        <div style={{ marginTop: 4 }}>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 12 }}>Platforms: </span>
            {platformOptions.map((p) => {
              const active = section.visibility?.platforms ?? [];
              const checked = active.includes(p);
              return (
                <label
                  key={p}
                  style={{ fontSize: 12, marginRight: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const current = new Set(
                        section.visibility?.platforms ?? []
                      );
                      if (e.target.checked) current.add(p);
                      else current.delete(p);
                      updateVisibility({
                        platforms: Array.from(current)
                      });
                    }}
                  />{" "}
                  {p}
                </label>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 4
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12 }}>minWidthPx</label>
              <input
                type="number"
                value={section.visibility?.minWidthPx ?? ""}
                onChange={(e) =>
                  updateVisibility({
                    minWidthPx: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined
                  })
                }
                style={{ width: "100%", fontSize: 12, padding: 4 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12 }}>maxWidthPx</label>
              <input
                type="number"
                value={section.visibility?.maxWidthPx ?? ""}
                onChange={(e) =>
                  updateVisibility({
                    maxWidthPx: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined
                  })
                }
                style={{ width: "100%", fontSize: 12, padding: 4 }}
              />
            </div>
          </div>
        </div>
      </details>

      {/* Image section specific */}
      {section.type === "image" && (
        <>
          <label style={{ fontSize: 12 }}>Image URL</label>
          <input
            value={(section as ImageSection).src ?? ""}
            onChange={(e) =>
              update({ ...(section as ImageSection), src: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4, marginBottom: 4 }}
          />
          <label style={{ fontSize: 12 }}>Alt text</label>
          <input
            value={(section as ImageSection).alt ?? ""}
            onChange={(e) =>
              update({ ...(section as ImageSection), alt: e.target.value })
            }
            style={{ width: "100%", fontSize: 12, padding: 4, marginBottom: 4 }}
          />
        </>
      )}

      {/* Text/Hero section specific */}
      {isText && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <strong style={{ fontSize: 12 }}>Text blocks</strong>
          {(section as TextSection).blocks.map((b, idx) => (
            <div
              key={b.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                padding: 6,
                marginTop: 4
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4
                }}
              >
                <span style={{ fontSize: 12 }}>
                  Block {idx + 1}: {b.variant}
                </span>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#DC2626",
                    cursor: "pointer",
                    fontSize: 11
                  }}
                  onClick={() => {
                    const nextBlocks = [
                      ...(section as TextSection).blocks
                    ].filter((x) => x.id !== b.id);
                    update({ ...(section as TextSection), blocks: nextBlocks });
                  }}
                >
                  ✕
                </button>
              </div>

              <label style={{ fontSize: 12 }}>Variant</label>
              <select
                value={b.variant}
                onChange={(e) => {
                  const nextBlocks = [
                    ...(section as TextSection).blocks
                  ].map((x) =>
                    x.id === b.id
                      ? { ...x, variant: e.target.value as TextVariant }
                      : x
                  );
                  update({ ...(section as TextSection), blocks: nextBlocks });
                }}
                style={{
                  width: "100%",
                  fontSize: 12,
                  padding: 4,
                  marginBottom: 4
                }}
              >
                {textVariantOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: 12 }}>Text</label>
              <textarea
                value={b.text}
                onChange={(e) => {
                  const nextBlocks = [
                    ...(section as TextSection).blocks
                  ].map((x) =>
                    x.id === b.id
                      ? { ...x, text: e.target.value }
                      : x
                  );
                  update({ ...(section as TextSection), blocks: nextBlocks });
                }}
                rows={2}
                style={{
                  width: "100%",
                  fontSize: 12,
                  padding: 4,
                  marginBottom: 4,
                  resize: "vertical"
                }}
              />

              {/* Style options */}
              <details>
                <summary style={{ fontSize: 12, cursor: "pointer" }}>
                  Style
                </summary>
                <div style={{ marginTop: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 4
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12 }}>Color</label>
                      <select
                        value={b.style?.color ?? "default"}
                        onChange={(e) => {
                          const nextBlocks = [
                            ...(section as TextSection).blocks
                          ].map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  style: {
                                    ...(x.style ?? {}),
                                    color: e.target
                                      .value as TextColorToken
                                  }
                                }
                              : x
                          );
                          update({
                            ...(section as TextSection),
                            blocks: nextBlocks
                          });
                        }}
                        style={{
                          width: "100%",
                          fontSize: 12,
                          padding: 4
                        }}
                      >
                        {textColorOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12 }}>Weight</label>
                      <select
                        value={b.style?.weight ?? "regular"}
                        onChange={(e) => {
                          const nextBlocks = [
                            ...(section as TextSection).blocks
                          ].map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  style: {
                                    ...(x.style ?? {}),
                                    weight: e.target
                                      .value as TextStyle["weight"]
                                  }
                                }
                              : x
                          );
                          update({
                            ...(section as TextSection),
                            blocks: nextBlocks
                          });
                        }}
                        style={{
                          width: "100%",
                          fontSize: 12,
                          padding: 4
                        }}
                      >
                        <option value="regular">regular</option>
                        <option value="medium">medium</option>
                        <option value="semibold">semibold</option>
                        <option value="bold">bold</option>
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 4
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12 }}>Align</label>
                      <select
                        value={b.style?.align ?? "left"}
                        onChange={(e) => {
                          const nextBlocks = [
                            ...(section as TextSection).blocks
                          ].map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  style: {
                                    ...(x.style ?? {}),
                                    align: e.target
                                      .value as TextStyle["align"]
                                  }
                                }
                              : x
                          );
                          update({
                            ...(section as TextSection),
                            blocks: nextBlocks
                          });
                        }}
                        style={{
                          width: "100%",
                          fontSize: 12,
                          padding: 4
                        }}
                      >
                        <option value="left">left</option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                        <option value="justify">justify</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12 }}>Transform</label>
                      <select
                        value={b.style?.transform ?? "none"}
                        onChange={(e) => {
                          const nextBlocks = [
                            ...(section as TextSection).blocks
                          ].map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  style: {
                                    ...(x.style ?? {}),
                                    transform: e.target
                                      .value as TextStyle["transform"]
                                  }
                                }
                              : x
                          );
                          update({
                            ...(section as TextSection),
                            blocks: nextBlocks
                          });
                        }}
                        style={{
                          width: "100%",
                          fontSize: 12,
                          padding: 4
                        }}
                      >
                        <option value="none">none</option>
                        <option value="uppercase">uppercase</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">capitalize</option>
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 4
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12 }}>Spacing top</label>
                      <select
                        value={b.style?.spacingTop ?? "none"}
                        onChange={(e) => {
                          const nextBlocks = [
                            ...(section as TextSection).blocks
                          ].map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  style: {
                                    ...(x.style ?? {}),
                                    spacingTop: e.target
                                      .value as SpacingToken
                                  }
                                }
                              : x
                          );
                          update({
                            ...(section as TextSection),
                            blocks: nextBlocks
                          });
                        }}
                        style={{
                          width: "100%",
                          fontSize: 12,
                          padding: 4
                        }}
                      >
                        {spacingOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12 }}>Spacing bottom</label>
                      <select
                        value={b.style?.spacingBottom ?? "none"}
                        onChange={(e) => {
                          const nextBlocks = [
                            ...(section as TextSection).blocks
                          ].map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  style: {
                                    ...(x.style ?? {}),
                                    spacingBottom: e.target
                                      .value as SpacingToken
                                  }
                                }
                              : x
                          );
                          update({
                            ...(section as TextSection),
                            blocks: nextBlocks
                          });
                        }}
                        style={{
                          width: "100%",
                          fontSize: 12,
                          padding: 4
                        }}
                      >
                        {spacingOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 4 }}>
                    <label style={{ fontSize: 12 }}>Max lines</label>
                    <input
                      type="number"
                      value={b.style?.maxLines ?? ""}
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined;
                        const nextBlocks = [
                          ...(section as TextSection).blocks
                        ].map((x) =>
                          x.id === b.id
                            ? {
                                ...x,
                                style: { ...(x.style ?? {}), maxLines: value }
                              }
                            : x
                        );
                        update({
                          ...(section as TextSection),
                          blocks: nextBlocks
                        });
                      }}
                      style={{
                        width: "100%",
                        fontSize: 12,
                        padding: 4
                      }}
                    />
                  </div>
                </div>
              </details>
            </div>
          ))}
          <button
            style={{
              marginTop: 4,
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #D1D5DB",
              backgroundColor: "#F9FAFB",
              cursor: "pointer"
            }}
            onClick={() => {
              const textSection = section as TextSection;
              const nextBlocks = [
                ...textSection.blocks,
                {
                  id: `block_${textSection.blocks.length + 1}`,
                  variant: "body1",
                  text: "New text"
                } as TextBlock
              ];
              update({ ...textSection, blocks: nextBlocks });
            }}
          >
            + Add text block
          </button>

          <hr style={{ margin: "6px 0" }} />
          <strong style={{ fontSize: 12 }}>Section CTAs</strong>
          {(section as TextSection).ctas?.map((c) => (
            <CtaEditor
              key={c.id}
              cta={c}
              onChange={(next) => {
                const txt = section as TextSection;
                const nextCtas = (txt.ctas ?? []).map((x) =>
                  x.id === c.id ? next : x
                );
                update({ ...txt, ctas: nextCtas });
              }}
              onRemove={() => {
                const txt = section as TextSection;
                const nextCtas = (txt.ctas ?? []).filter(
                  (x) => x.id !== c.id
                );
                update({ ...txt, ctas: nextCtas });
              }}
            />
          ))}
          <button
            style={{
              marginTop: 4,
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #D1D5DB",
              backgroundColor: "#F9FAFB",
              cursor: "pointer"
            }}
            onClick={() => {
              const txt = section as TextSection;
              const nextCtas: CTAConfig[] = [
                ...(txt.ctas ?? []),
                {
                  id: `cta_${(txt.ctas ?? []).length + 1}`,
                  label: "New CTA",
                  kind: "button",
                  priority: "primary",
                  size: "md",
                  action: { type: "noop" }
                }
              ];
              update({ ...txt, ctas: nextCtas });
            }}
          >
            + Add CTA
          </button>
        </>
      )}
    </div>
  );
};

/* ------------------ MAIN APP ------------------ */

const initialScreen: ScreenConfig = {
  id: "module_not_enabled_example",
  version: 1,
  layout: "split-left-text-right-media",
  theme: {
    colorScheme: "light",
    background: "surface",
    accent: "primary"
  },
  sections: [
    {
      id: "hero_left",
      type: "hero",
      width: "1/2",
      align: "left",
      padding: "md",
      margin: "none",
      blocks: [
        {
          id: "eyebrow",
          variant: "eyebrow",
          text: "MEASURE / EXPERIMENTS",
          style: { color: "muted", spacingBottom: "xs" }
        },
        {
          id: "headline",
          variant: "heading1",
          text: "This module isn't enabled on your account yet"
        },
        {
          id: "body",
          variant: "body1",
          text:
            "Please contact your account manager if you'd like to activate it.",
          style: { color: "muted", spacingTop: "sm" }
        }
      ],
      ctas: [
        {
          id: "contact_am",
          label: "Talk to Account Management",
          kind: "button",
          priority: "primary",
          size: "md",
          action: {
            type: "mailto",
            email: "am@example.com",
            subject: "Enable Experiments"
          }
        }
      ]
    },
    {
      id: "hero_image",
      type: "image",
      width: "1/2",
      align: "center",
      padding: "md",
      margin: "none",
      src: "https://via.placeholder.com/400x260.png?text=Hero+image",
      alt: "Module not enabled"
    }
  ],
  ctas: []
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenConfig>(initialScreen);

  const updateSectionAt = (idx: number, next: Section) => {
    const nextSections = [...screen.sections];
    nextSections[idx] = next;
    setScreen({ ...screen, sections: nextSections });
  };

  const addSection = () => {
    const next: TextSection = {
      id: `section_${screen.sections.length + 1}`,
      type: "text",
      width: "full",
      align: "left",
      padding: "md",
      margin: "none",
      blocks: [
        {
          id: "block_1",
          variant: "heading2",
          text: "New section"
        }
      ],
      ctas: []
    };
    setScreen({ ...screen, sections: [...screen.sections, next] });
  };

  const removeSection = (idx: number) => {
    const next = screen.sections.filter((_, i) => i !== idx);
    setScreen({ ...screen, sections: next });
  };

  const addGlobalCta = () => {
    const next: CTAConfig = {
      id: `global_cta_${(screen.ctas ?? []).length + 1}`,
      label: "Global CTA",
      kind: "button",
      priority: "secondary",
      size: "md",
      action: { type: "noop" }
    };
    setScreen({
      ...screen,
      ctas: [...(screen.ctas ?? []), next]
    });
  };

  const updateGlobalCta = (idx: number, next: CTAConfig) => {
    const arr = [...(screen.ctas ?? [])];
    arr[idx] = next;
    setScreen({ ...screen, ctas: arr });
  };

  const removeGlobalCta = (idx: number) => {
    const arr = (screen.ctas ?? []).filter((_, i) => i !== idx);
    setScreen({ ...screen, ctas: arr });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1.8fr)",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 14,
        color: "#111827"
      }}
    >
      {/* LEFT: Config Editor */}
      <div
        style={{
          borderRight: "1px solid #E5E7EB",
          padding: 12,
          overflow: "auto",
          backgroundColor: "#F9FAFB"
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 8
          }}
        >
          Screen Config Editor
        </h2>

        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: 8,
            marginBottom: 8,
            backgroundColor: "#FFFFFF"
          }}
        >
          <label style={{ fontSize: 12 }}>Screen ID</label>
          <input
            value={screen.id}
            onChange={(e) =>
              setScreen({ ...screen, id: e.target.value })
            }
            style={{
              width: "100%",
              fontSize: 12,
              padding: 4,
              marginBottom: 4
            }}
          />
          <label style={{ fontSize: 12 }}>Version</label>
          <input
            type="number"
            value={screen.version}
            onChange={(e) =>
              setScreen({
                ...screen,
                version: parseInt(e.target.value || "1", 10)
              })
            }
            style={{
              width: "100%",
              fontSize: 12,
              padding: 4,
              marginBottom: 4
            }}
          />

          <label style={{ fontSize: 12 }}>Layout</label>
          <select
            value={screen.layout}
            onChange={(e) =>
              setScreen({
                ...screen,
                layout: e.target.value as LayoutType
              })
            }
            style={{
              width: "100%",
              fontSize: 12,
              padding: 4,
              marginBottom: 4
            }}
          >
            {layoutOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <details>
            <summary style={{ fontSize: 12, cursor: "pointer" }}>
              Theme
            </summary>
            <div style={{ marginTop: 4 }}>
              <label style={{ fontSize: 12 }}>Color scheme</label>
              <select
                value={screen.theme?.colorScheme ?? "light"}
                onChange={(e) =>
                  setScreen({
                    ...screen,
                    theme: {
                      ...(screen.theme ?? {}),
                      colorScheme: e.target
                        .value as ColorScheme
                    }
                  })
                }
                style={{
                  width: "100%",
                  fontSize: 12,
                  padding: 4,
                  marginBottom: 4
                }}
              >
                {colorSchemeOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: 12 }}>Background</label>
              <select
                value={screen.theme?.background ?? "surface"}
                onChange={(e) =>
                  setScreen({
                    ...screen,
                    theme: {
                      ...(screen.theme ?? {}),
                      background: e.target
                        .value as BackgroundToken
                    }
                  })
                }
                style={{
                  width: "100%",
                  fontSize: 12,
                  padding: 4,
                  marginBottom: 4
                }}
              >
                {backgroundOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: 12 }}>Accent</label>
              <select
                value={screen.theme?.accent ?? "primary"}
                onChange={(e) =>
                  setScreen({
                    ...screen,
                    theme: {
                      ...(screen.theme ?? {}),
                      accent: e.target.value as AccentToken
                    }
                  })
                }
                style={{
                  width: "100%",
                  fontSize: 12,
                  padding: 4,
                  marginBottom: 4
                }}
              >
                {accentOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </details>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Sections
          </h3>
          <button
            style={{
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #D1D5DB",
              backgroundColor: "#FFFFFF",
              cursor: "pointer"
            }}
            onClick={addSection}
          >
            + Add section
          </button>
        </div>

        {screen.sections.map((s, idx) => (
          <SectionEditor
            key={s.id}
            section={s}
            onChange={(next) => updateSectionAt(idx, next)}
            onRemove={() => removeSection(idx)}
          />
        ))}

        <hr style={{ margin: "8px 0" }} />
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 4
          }}
        >
          Global CTAs
        </h3>
        {(screen.ctas ?? []).map((c, idx) => (
          <CtaEditor
            key={c.id}
            cta={c}
            onChange={(next) => updateGlobalCta(idx, next)}
            onRemove={() => removeGlobalCta(idx)}
          />
        ))}
        <button
          style={{
            marginTop: 4,
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid #D1D5DB",
            backgroundColor: "#FFFFFF",
            cursor: "pointer"
          }}
          onClick={addGlobalCta}
        >
          + Add global CTA
        </button>
      </div>

      {/* MIDDLE: JSON Preview */}
      <div
        style={{
          borderRight: "1px solid #E5E7EB",
          padding: 12,
          overflow: "auto",
          backgroundColor: "#F3F4F6"
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 8
          }}
        >
          JSON Config
        </h2>
        <pre
          style={{
            fontSize: 11,
            backgroundColor: "#111827",
            color: "#E5E7EB",
            padding: 8,
            borderRadius: 8,
            overflow: "auto",
            maxHeight: "90vh"
          }}
        >
{JSON.stringify(screen, null, 2)}
        </pre>
      </div>

      {/* RIGHT: Live preview */}
      <div style={{ overflow: "auto" }}>
        <DynamicScreen screen={screen} />
      </div>
    </div>
  );
};

export default App;
