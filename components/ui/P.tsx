export const P = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <p
      className={`${config ? config : ''} text-base lg:text-lg`}
      style={{ color: color }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};