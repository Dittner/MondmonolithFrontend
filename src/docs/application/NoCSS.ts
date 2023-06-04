import {LayoutLayer} from "./Application";

const abbreviations:{[prop: string]:string} = {
  "align-items": "a_",
  "bottom": "b_",
  "box-sizing": "s_",
  "display" : "d_",
  "flex-direction" : "f_",
  "gap" : "g_",
  "height": "h_",
  "justify-content": "j_",
  "left": "l_",
  "margin-left": "ml_",
  "margin-right": "mr_",
  "margin-top": "mt_",
  "margin-bottom": "mb_",
  "max-height": "mah_",
  "max-width": "maw_",
  "min-height": "mih_",
  "min-width": "miw_",
  "overflow": "o_",
  "padding-left": "pl_",
  "padding-right": "pr_",
  "padding-top": "pt_",
  "padding-bottom": "pb_",
  "position": "p_",
  "right": "r_",
  "top": "t_",
  "transition": "tr_",
  "width": "w_",
  "z-index": "z_",
}

let dynamicStyleSheet: CSSStyleSheet
const notAllowedSymbolsInClassName = /[%. ]+/g;
const classNameHash = new Map<string,string>()

export const build = (): SelectorRuleBuilder => {
  return new SelectorRuleBuilder()
}

export class SelectorRuleBuilder {
  private hashSum:string
  private style:string

  constructor(hashSum:string = "", style="{box-sizing:border-box;") {
    if(!dynamicStyleSheet) {
      dynamicStyleSheet = new CSSStyleSheet();
      document.adoptedStyleSheets = [dynamicStyleSheet];
      //dynamicStyleSheet.insertRule(".redlbl{color:#ff0000;font-size:50px}");
    }
    this.hashSum = hashSum;
    this.style = style;
  }

  width(value: string):SelectorRuleBuilder {             this.setValue("width", value); return this}
  height(value: string):SelectorRuleBuilder {            this.setValue("height", value); return this}
  minHeight(value: string):SelectorRuleBuilder {         this.setValue("min-height", value); return this}
  maxHeight(value: string):SelectorRuleBuilder {         this.setValue("max-height", value); return this}
  minWidth(value: string):SelectorRuleBuilder {          this.setValue("min-width", value); return this}
  maxWidth(value: string):SelectorRuleBuilder {          this.setValue("max-width", value); return this}
  left(value: string):SelectorRuleBuilder {              this.setValue("left", value); return this}
  right(value: string):SelectorRuleBuilder {             this.setValue("right", value); return this}
  top(value: string):SelectorRuleBuilder {               this.setValue("top", value); return this}
  bottom(value: string):SelectorRuleBuilder {            this.setValue("bottom", value); return this}
  paddingLeft(value: string):SelectorRuleBuilder {       this.setValue("padding-left", value); return this}
  paddingRight(value: string):SelectorRuleBuilder {      this.setValue("padding-right", value); return this}
  paddingHorizontal(value: string):SelectorRuleBuilder { this.setValue("padding-left", value); this.setValue("padding-right", value); return this}
  paddingTop(value: string):SelectorRuleBuilder {        this.setValue("padding-top", value); return this}
  paddingBottom(value: string):SelectorRuleBuilder {     this.setValue("padding-bottom", value); return this}
  paddingVertical(value: string):SelectorRuleBuilder {   this.setValue("padding-top", value); this.setValue("padding-bottom", value); return this}
  padding(value: string):SelectorRuleBuilder {           this.setValue("padding-left", value); this.setValue("padding-right", value); this.setValue("padding-top", value); this.setValue("padding-bottom", value); return this}
  layer(value: LayoutLayer):SelectorRuleBuilder {        this.setValue("z-index", value); return this}
  fixed():SelectorRuleBuilder {                          this.setValue("position", "fixed"); return this}
  enableOwnScroller():SelectorRuleBuilder {              this.setValue("overflow", "auto"); return this}
  absolute():SelectorRuleBuilder {                       this.setValue("position", "absolute"); return this}
  animate(value: string):SelectorRuleBuilder {           this.setValue("transition", value); return this} // "left 0.5s"

  public setValue(key:string, value:string) {
    if(!abbreviations.hasOwnProperty(key))
      throw new Error("SelectorRuleBuilder:: No abbreviation for tag: " + key)
    this.style += key + ':' + value + ';'
    this.hashSum += abbreviations[key] + value + "-"
  }

  className():string {
    if(!this.hashSum) return ""

    if(classNameHash.has(this.hashSum))
      return classNameHash.get(this.hashSum) as string

    const className = this.hashSum.replace(notAllowedSymbolsInClassName, 'x')

    console.log("  --new selectorName: ", className)
    console.log("  --selectorsCount: ", ++selectorsCount)

    const rule = '.' + className + this.style + '}';
    classNameHash.set(this.hashSum, className)
    dynamicStyleSheet.insertRule(rule)
    return className
  }
}

let selectorsCount = 0

export const buildAndGetClassName = (props:any):string => {
  const builder = new SelectorRuleBuilder("stack-")
  if (props.hasOwnProperty("width")) builder.width(props.width);
  if (props.hasOwnProperty("height")) builder.height(props.height);
  if (props.hasOwnProperty("minHeight")) builder.minHeight(props.minHeight);
  if (props.hasOwnProperty("maxHeight")) builder.maxHeight(props.maxHeight);
  if (props.hasOwnProperty("minWidth")) builder.minHeight(props.minWidth);
  if (props.hasOwnProperty("maxWidth")) builder.maxWidth(props.maxWidth);
  if (props.hasOwnProperty("left")) builder.left(props.left);
  if (props.hasOwnProperty("right")) builder.right(props.right);
  if (props.hasOwnProperty("top")) builder.top(props.top);
  if (props.hasOwnProperty("bottom")) builder.bottom(props.bottom);

  if (props.hasOwnProperty("padding")) builder.padding(props.padding);
  if (props.hasOwnProperty("paddingHorizontal")) builder.paddingHorizontal(props.paddingHorizontal);
  if (props.hasOwnProperty("paddingVertical")) builder.paddingVertical(props.paddingVertical);

  if (props.hasOwnProperty("paddingLeft")) builder.paddingLeft(props.paddingLeft);
  if (props.hasOwnProperty("paddingRight")) builder.paddingRight(props.paddingRight);
  if (props.hasOwnProperty("paddingTop")) builder.paddingTop(props.paddingTop);
  if (props.hasOwnProperty("paddingBottom")) builder.paddingBottom(props.paddingBottom);
  if (props.hasOwnProperty("fixed") && props.fixed) builder.fixed();
  if (props.hasOwnProperty("enableOwnScroller") && props.enableOwnScroller) builder.enableOwnScroller();
  if (props.hasOwnProperty("layer")) builder.layer(props.layer);

  if (props.hasOwnProperty("boxSizing")) builder.setValue("box-sizing", props.boxSizing);
  if (props.hasOwnProperty("display")) builder.setValue("display", props.display);
  if (props.hasOwnProperty("gap")) builder.setValue("gap", props.gap);
  if (props.hasOwnProperty("flexDirection")) builder.setValue("flex-direction", props.flexDirection);
  if (props.hasOwnProperty("alignItems")) builder.setValue("align-items", props.alignItems);
  if (props.hasOwnProperty("justifyContent")) builder.setValue("justify-content", props.justifyContent);

  if (props.hasOwnProperty("marginLeft")) builder.setValue("margin-left", props.marginLeft);
  if (props.hasOwnProperty("marginRight")) builder.setValue("margin-right", props.marginRight);
  if (props.hasOwnProperty("marginTop")) builder.setValue("margin-top", props.marginTop);
  if (props.hasOwnProperty("marginBottom")) builder.setValue("margin-bottom", props.marginBottom);

  return builder.className()
}