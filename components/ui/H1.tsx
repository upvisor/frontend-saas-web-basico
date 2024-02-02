export const H1 = ({ children, config }: { children: React.ReactNode, config?: string }) => {
  return (
    <h1 className={`${config} text-[25px] font-semibold lg:text-[32px]`}>{ children }</h1>
  )
}