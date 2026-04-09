import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import FloatingHelpButton from './components/FloatingHelpButton'
import Navbar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import CreateAccountPage from './pages/CreateAccountPage'
import CategoriesPage from './pages/CategoriesPage'
import DealsPage from './pages/DealsPage'
import AdvisoryPage from './pages/AdvisoryPage'
import AdvisorySubPage from './pages/AdvisorySubPage'
import VedikaPage from './pages/VedikaPage'
import VedikaSubPage from './pages/VedikaSubPage'
import CreatePostPage from './pages/CreatePostPage'
import SchemesSubPage from './pages/SchemesSubPage'
import StoriesPage from './pages/StoriesPage'
import ClearancePage from './pages/ClearancePage'
import ContactPage from './pages/ContactPage'
import SupportPage from './pages/SupportPage'
import NotFoundPage from './pages/NotFoundPage'
import InfoPage from './pages/InfoPage'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import WishlistPage from './pages/WishlistPage'
import LanguagePage from './pages/LanguagePage'
import ProductsPage from './pages/ProductsPage'
import DashboardPage from './pages/DashboardPage'
import BrandsPage from './pages/BrandsPage'
import ShopByPage from './pages/ShopByPage'
import ProfilePage from './pages/ProfilePage'

function RequireAuth({ children }) {
  const location = useLocation()
  const isAuthenticated = Boolean(window.localStorage.getItem('agriconnectUser'))

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: `${location.pathname}${location.search}`, message: 'Please login to continue' }} />
  }

  return children
}

function App() {
  return (
    <>
      <Navbar />
      <FloatingHelpButton />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/categories" element={<RequireAuth><CategoriesPage /></RequireAuth>} />
        <Route path="/deals" element={<RequireAuth><DealsPage /></RequireAuth>} />
        <Route path="/advisory" element={<RequireAuth><AdvisoryPage /></RequireAuth>} />
        <Route path="/advisory/:topic" element={<RequireAuth><AdvisorySubPage /></RequireAuth>} />
        <Route path="/vedika" element={<RequireAuth><VedikaPage /></RequireAuth>} />
        <Route path="/create-post" element={<RequireAuth><CreatePostPage /></RequireAuth>} />
        <Route path="/vedika/post/:id" element={<RequireAuth><VedikaSubPage /></RequireAuth>} />
        <Route path="/schemes/:topic" element={<RequireAuth><SchemesSubPage /></RequireAuth>} />
        <Route path="/stories" element={<RequireAuth><StoriesPage /></RequireAuth>} />
        <Route path="/clearance" element={<RequireAuth><ClearancePage /></RequireAuth>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/support/:topic" element={<SupportPage />} />
        <Route path="/track-order" element={(
          <InfoPage
            title="Track order"
            summary="Follow delivery progress and dispatch updates."
            detailTitle="Order tracking"
            detailText="Use the tracking link from your SMS or email confirmation."
            linkTo="/support/delivery"
            linkLabel="Delivery support"
          />
        )} />
        <Route path="/wishlist" element={<RequireAuth><WishlistPage /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="/order-success" element={<RequireAuth><OrderSuccessPage /></RequireAuth>} />
        <Route path="/brands" element={<RequireAuth><BrandsPage /></RequireAuth>} />
        <Route path="/seeds" element={<RequireAuth><InfoPage
          title="Seeds"
          summary="Hybrid, vegetable, and specialty seed collections."
          detailTitle="Seed catalogue"
          detailText="Seasonal availability will be listed here soon."
        /></RequireAuth>} />
        <Route path="/crop-protection" element={<RequireAuth><InfoPage
          title="Crop protection"
          summary="Insecticides, fungicides, and integrated solutions."
          detailTitle="Protection plans"
          detailText="Product recommendations will appear after onboarding."
        /></RequireAuth>} />
        <Route path="/crop-nutrition" element={<RequireAuth><InfoPage
          title="Crop nutrition"
          summary="Fertilizers, micronutrients, and soil boosters."
          detailTitle="Nutrition kits"
          detailText="Nutrient schedules will be tailored per crop."
        /></RequireAuth>} />
        <Route path="/equipments" element={<RequireAuth><InfoPage
          title="Equipments"
          summary="Tools, sprayers, and field-ready machinery."
          detailTitle="Equipment list"
          detailText="Verified equipment bundles are coming soon."
        /></RequireAuth>} />
        <Route path="/animal-husbandry" element={<RequireAuth><InfoPage
          title="Animal husbandry"
          summary="Feed, supplements, and livestock care essentials."
          detailTitle="Livestock care"
          detailText="Curated packs will be added after partner intake."
        /></RequireAuth>} />
        <Route path="/organic" element={<RequireAuth><InfoPage
          title="Organic"
          summary="Bio inputs and natural crop care solutions."
          detailTitle="Organic range"
          detailText="Compliance-ready products will be published soon."
        /></RequireAuth>} />
        <Route path="/tapas" element={(
          <InfoPage
            title="Tapas"
            summary="Regional input packs and agri essentials."
            detailTitle="Regional kits"
            detailText="Local assortments will launch shortly."
          />
        )} />
        <Route path="/services" element={<RequireAuth><InfoPage
          title="Services"
          summary="Advisory, diagnostics, and post-harvest help."
          detailTitle="Service desk"
          detailText="Service booking tools are coming soon."
          linkTo="/advisory"
          linkLabel="Explore advisory"
        /></RequireAuth>} />
        <Route path="/blogs" element={(
          <InfoPage
            title="Blogs"
            summary="Updates on crops, weather, and market trends."
            detailTitle="Latest posts"
            detailText="Content updates will start once the editorial queue is live."
          />
        )} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
        <Route path="/shop-by/:category" element={<RequireAuth><ShopByPage /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/dashboard/:role" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/detail/:type/:name" element={<RequireAuth><DetailPage /></RequireAuth>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
