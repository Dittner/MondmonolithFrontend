export enum VAlign {
  TOP = "TOP",
  CENTER = "CENTER",
  BOTTOM = "BOTTOM",
}

export enum HAlign {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
}

const buildClassName = (halign: HAlign, valign: VAlign): string => {
  let res = ""
  switch (halign) {
    case HAlign.LEFT:
      res += "halignLeft";
      break;
    case HAlign.CENTER:
      res += "halignCenter";
      break;
    case HAlign.RIGHT:
      res += "halignRight";
      break;
  }

  switch (valign) {
    case VAlign.TOP:
      res += " valignTop";
      break;
    case VAlign.CENTER:
      res += " valignCenter";
      break;
    case VAlign.BOTTOM:
      res += " valignBottom";
      break;
  }

  return res;
}

export const VStack = ({halign, valign, children}: { halign: HAlign, valign: VAlign, children: any }) => {
  const className = "vstack " + buildClassName(halign, valign)
  return <div className={className}>
    {children}
  </div>
}

export const HStack = ({halign, valign, children}: { halign: HAlign, valign: VAlign, children: any }) => {
  const className = "hstack " + buildClassName(halign, valign)
  return <div className={className}>
    {children}
  </div>
}