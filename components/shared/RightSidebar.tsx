export default function RightSidebar() {
    return (
        <section className="custon-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Tricks</h3>
                 <div className='mt-7 flex w-[350px] flex-col gap-9'>

                <ul>
                    <li className='!text-base-regular text-light-3'>Ollie</li>
                    <li className='!text-base-regular text-light-3'>Fronside 180</li>
                    <li className='!text-base-regular text-light-3'>Pop Shuvit</li>
                    <li className='!text-base-regular text-light-3'>Fronstide Shuvit</li>
                    <li className='!text-base-regular text-light-3'>Backside 180</li>
                    <li className='!text-base-regular text-light-3'>Kickflip</li>
                    <li className='!text-base-regular text-light-3'>Heelflip</li>
                    <li className='!text-base-regular text-light-3'>Treflip</li>
                </ul>
                 </div>
            </div>

            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light1">
                    Suggested Spots
                </h3>
            </div>
        </section>
    )
}