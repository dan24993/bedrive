export interface IgnitionVendorGroup {
  vendorGroup: true;
  items: IgnitionFrame[];
}

export interface IgnitionErrorPayload {
  ignitionTrace: true;
  message: string;
  exception: string;
  line: number;
  trace: (IgnitionVendorGroup | IgnitionFrame)[];
  totalVendorGroups: number;
}

export interface IgnitionFrame {
  codeSnippet: Record<number, string>;
  path: string[];
  lineNumber: number;
  method: string;
  flatIndex: number;
}
