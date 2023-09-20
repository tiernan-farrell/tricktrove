import {
  OrganizationSwitcher,
  SignedIn,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Image from "next/image";
import MySignOutButton from "./MySignOutButton";


async function Navbar() {
  return (
    <nav className="topbar">
      {/* <Link href="/" className="flex items-center gap-1 self-start">
        <Image
          src="/logo.svg"
          alt="logo"
          width={48}
          height={48}
          className="logo"
        />
      </Link> */}



        <div className="org">
          <OrganizationSwitcher
            appearance={{
              baseTheme: dark,
              elements: {
                organizationSwitcherTrigger: "py-2 px-4",
              },
            }}
          />
        </div>
        <div className="logo-lettering ">

        <Link href="/" >
          <p className="text-heading3-bold  text-primary-500 max-xs:hidden">
            TrickTrove
          </p>
        </Link>
        </div>

        <div className="top-bar-signout">
            <MySignOutButton />
        </div>
        
    </nav>
  );
}

export default Navbar;
