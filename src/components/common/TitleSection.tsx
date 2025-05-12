import React from 'react'

interface ITitleProps {
    title : string
}

const TitleSection: React.FC<ITitleProps> = ({ title }) => {
  return (
    <p className="text-2xl font-bold">{title}</p>
  )
}

export default TitleSection