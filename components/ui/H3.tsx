export const H3 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h3
      className={`${config ? config : 'font-semibold'} text-xl lg:text-3xl`}
      style={{ color: color }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};