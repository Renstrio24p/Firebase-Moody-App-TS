declare module "*";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'opn'

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'require-context' {
  function requireContext(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ): {
    keys(): string[];
    <T>(id: string): T;
  }

  export = requireContext;
}
