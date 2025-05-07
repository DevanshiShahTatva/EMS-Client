import React from "react";

const Gallary = () => {
  return (
    <>
       
       <section className="bg-[#F5F7FC] px-[0px] py-12 md:py-20">
        <div
          className="w-full h-[500px] bg-repeat-x bg-center bg-[length:auto_500px] overflow-hidden"
          style={{
            // backgroundImage: `url('https://unsplash.com/assets/api/api-photo-grid@2x-388d83e210e483af53295e6574d71e343557875502b68b56b3cf0e1c0040b440.jpg')`,
            backgroundImage: `url('https://res.cloudinary.com/dv2n0s4mh/image/upload/v1746604054/Untitled_design_lwxnvo.png')`,
            animation: "scrollGrid 200s linear infinite",
          }}
        />
      </section>
    </>
  );
};

export default Gallary;
