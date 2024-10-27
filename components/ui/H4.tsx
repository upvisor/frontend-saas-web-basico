export const H4 = ({ config, text }: { config?: string, text?: string }) => {
  return (
    <h4
      className={`${config ? config : 'font-semibold'} text-lg lg:text-2xl`}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};