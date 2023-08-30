import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

async function Navbar() {
  const User = await currentUser();

  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/logo.svg' alt='logo' width={48} height={48} className="logo"/>
        <p className='text-heading3-bold text-dark-1 max-xs:hidden'>TrickTrove</p>
      </Link>

      <div className='flex items-center gap-1'>
        <SignedIn>
          <p className='text-heading3-bold text-light-1 max-xs:hidden'>{User?.username}</p>
        </SignedIn>
      </div>

      <div className='flex items-center gap-1'>
        <div className='block md:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                  className="text-light-1"
                />
              </div>
            </SignOutButton>
          </SignedIn>

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
