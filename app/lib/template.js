// @flow

interface CommitStyleBase {
  /**
   * Spacing between commits
   */
  spacing: number,
  /**
   * Commit color (dot & message)
   */
  color?: string,
  /**
   * Tooltips policy
   */
  hasTooltipInCompactMode: boolean
}

interface BranchStyle {
  /**
   * Branch color
   */
  color?: string,
  /**
   * Branch line width in pixel
   */
  lineWidth: number,
  /**
   * Branch merge style
   */
  mergeStyle: MergeStyle,
  /**
   * Space between branches
   */
  spacing: number,
  /**
   * Branch label style
   */
  label: BranchLabelStyleOptions
}

type BranchStyleOptions = Partial<BranchStyle>;

export interface TemplateOptions {
  branch?: BranchStyleOptions;
}
