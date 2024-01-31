export default function Filters () {
  return (
    <div className="w-full flex px-4">
      <div className="max-w-[1600px] w-full m-auto flex gap-4 justify-between flex-wrap">
        <button>Filtros</button>
        <select className="border rounded py-1 w-44">
          <option>Más recientes</option>
          <option>Mayor precio</option>
          <option>Menor precio</option>
        </select>
      </div>
    </div>
  )
}