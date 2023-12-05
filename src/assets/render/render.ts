import Moody from "../../components/Moody"

export default function Render(){

  const TSDOM = document.querySelector('#moody') as HTMLDivElement | null
  {TSDOM && Moody(TSDOM)}

}