// ** React Imports
import { useEffect , useState} from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'
import API_URL from '../../../../../config'
const VerticalMenuHeader = props => {
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props

  // ** Vars
  const user = getUserData()
  const [hotelName, setHotelName] = useState(null);
  const [logoimage, setLogo] = useState(null);
  // ** Reset open group
  // useEffect(() => {
  //   if (!menuHover && menuCollapsed) setGroupOpen([])
  //   fetchx(API_URL + "/getBusinessDate", {
  //     method: "POST",
  //     headers: { 'Content-Type': 'application/json' },
  //   }).then((res) => res.json())
  //     .then(postres => {
  //       if(postres['statusCode'] === 200){
  //         setHotelName(postres['data'][0]['name'])
  //         setLogo(postres['data'][0]['logo'])
  //       }
  //     })
  // }, [menuHover, menuCollapsed])

  useEffect(() => {
    const fetchBusinessDate = async () => {
      try {
        const response = await fetchx(API_URL + '/getBusinessDate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const postres = await response.json();
        setHotelName(postres.data[0].name);
        setLogo(postres.data[0].logo);
      } catch (error) {
        console.error('Error fetching business date:', error);
      }
    };
    fetchBusinessDate();
  }, []); // Empty dependency array to run only once
  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);
  
  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <NavLink to={user ? getHomeRouteForLoggedInUser(user.role) : '/'} className='navbar-brand'>
            <span className='brand-logo'>
              {/* <img src={themeConfig.app.appLogoImage} alt='logo' /> */}
              {/* <img  src={API_URL+ `/imagepaths/${logoimage}`} alt='logo' /> */}
              {logoimage!== null && <img  src={API_URL+ `/imagepaths/${logoimage}`} alt='logo' />}
            </span>
            {/* <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>
             */}
             <h2 className='brand-text mb-0' style={{ whiteSpace: 'pre-wrap' }}>{hotelName}</h2>
            {/* <h2 className='brand-text mb-0' style={{ wordWrap: 'break-word' }}>{hotelName}</h2> */}
          </NavLink>
        </li>
        {/* <li className='nav-item nav-toggle'>
          <div className='nav-link modern-nav-toggle cursor-pointer'>
            <Toggler />
            <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20} />
          </div>
        </li> */}
      </ul>
    </div>
  )
}

export default VerticalMenuHeader