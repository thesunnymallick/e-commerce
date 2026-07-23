import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router'
import { useSelector } from 'react-redux';

const AppLayout = () => {
  const user = useSelector((state: any) => state.auth.user);
  return (
      <>
       <Header/>
          <Outlet/>
        <Footer/>
      </>
  )
}

export default AppLayout