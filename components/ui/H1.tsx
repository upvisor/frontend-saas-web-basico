export const H1 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h1
      className={`${config ? config : 'font-semibold'} text-3xl lg:text-5xl`}
      style={{ color: color }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};