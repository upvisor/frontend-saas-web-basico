export const P = ({ children, config }: { children: React.ReactNode, config?: string }) => {
  return (
    <p className={`${config} text-sm lg:text-[16px]`}>{ children }</p>
  )
}