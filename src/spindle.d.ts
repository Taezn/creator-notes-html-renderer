declare module "@lumiverse/spindle" {
  export function rpc(method: string, params?: Record<string, unknown>): Promise<any>;
  export function registerFloatWidget(id: string, config: FloatWidgetConfig): void;
}

interface FloatWidgetConfig {
  label: string;
  icon?: string;
  width?: number;
  height?: number;
  resizable?: boolean;
  snap?: "left" | "right" | "top" | "bottom";
  render: (ctx: WidgetContext) => Promise<string>;
  onUpdate?: (ctx: WidgetContext) => Promise<void>;
}

interface WidgetContext {
  activeCharacterId: string | null;
  update(html: string): void;
}
