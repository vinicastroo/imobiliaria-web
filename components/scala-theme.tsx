/**
 * Tema da marca Scala (plataforma) para o painel admin e o login.
 *
 * O root layout injeta as cores do tenant em `:root` (--primary, --secondary,
 * --font-body). Este <style> é renderizado depois, dentro do layout do
 * admin/login, e tem a mesma especificidade — então vence e devolve a marca
 * Scala a essas telas, inclusive a portais (dialogs, popovers) que montam
 * direto no <body>. Os sites públicos não usam este componente e seguem com
 * as cores do cliente.
 *
 * Valores em design/tokens.css (fonte da verdade) e DESIGN.md.
 */
const SCALA_THEME = `:root {
  --primary: #1f4fd1;
  --primary-foreground: #ffffff;
  --secondary: #eaf0fe;
  --secondary-foreground: #163a99;
  --ring: #1f4fd1;
  --font-body: var(--font-sora), system-ui, sans-serif;

  --scala-sidebar: #0d1530;
  --scala-sidebar-accent: #6e93ff;

  /* Marca Scala (design/tokens.css) */
  --scala-ink: #141a22;
  --scala-night: #0d1530;
  --scala-paper: #f7f7f5;
  --scala-muted: #5d6673;
  --scala-border: #141a221f;
  --scala-royal: #1f4fd1;
  --scala-royal-hover: #1a43b3;
  --scala-royal-soft: #eaf0fe;
  --scala-royal-200: #b9cbf8;
  --scala-royal-400: #6e93ff;
}`

export function ScalaTheme() {
  return <style dangerouslySetInnerHTML={{ __html: SCALA_THEME }} />
}
