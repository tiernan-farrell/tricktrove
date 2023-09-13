import { OrganizationSwitcher, SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Image from "next/image";



async function Navbar() {
  
  return (

    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-1'>
        <Image src='/logo.svg' alt='logo' width={48} height={48} className="logo"/>
      </Link>


      <div className='flex items-center gap-1'>
        <div className='block md:hidden'>
          <UserButton afterSignOutUrl="/" ></UserButton>
          {/* <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
            
          </SignedIn> */}
        </div>

        <Link href='/' className='flex items-center gap-1'>

        <p className='text-heading3-bold  text-primary-500 max-xs:hidden'>TrickTrove</p>
        </Link>


        <div className="block ">
       
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
          />
          </div>
      </div>

    </nav>
  );
}

export default Navbar;
