import React from "react";

const Gallary = () => {
  return (
    <>
      <section className="bg-[#F5F7FC] px-[0px] py-12 md:py-20">
        <div
          className="w-full h-[500px] bg-repeat-x bg-center bg-[length:auto_500px] overflow-hidden"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dv2n0s4mh/image/upload/v1746608863/photo-grid_4_qnjsab.png')`,
            animation: "scrollGrid 50s linear infinite",
          }}
        />
      </section>
    </>
  );
};

export default Gallary;
