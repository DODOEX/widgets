import { useCallback } from 'react';
import { Description, OptButton, Title } from './index.styled';

function DepthChartV2({
  title,
  titleColor,
  description,
  descriptionColor,
  buttonColor,
  placeholder,
}: {
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  buttonColor: string;
  placeholder: React.ReactElement;
}) {
  const handleDragButtonMouseDown = useCallback((moveLeft?: boolean) => {}, []);
  const handleZoomButtonMouseDown = useCallback((zoomIn?: boolean) => {}, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title color={titleColor}>{title}</Title>
          <Description color={descriptionColor}>{description}</Description>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <OptButton onClick={() => handleDragButtonMouseDown(true)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="12"
                fill={buttonColor}
                fillOpacity="0.1"
              />
              <path
                d="M13.9425 7.77734L15 8.83484L11.565 12.2773L15 15.7198L13.9425 16.7773L9.4425 12.2773L13.9425 7.77734Z"
                fill={buttonColor}
              />
            </svg>
          </OptButton>
          <OptButton onClick={() => handleZoomButtonMouseDown(false)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="12"
                fill={buttonColor}
                fillOpacity="0.1"
              />
              <rect x="8" y="11" width="8" height="1.5" fill={buttonColor} />
            </svg>
          </OptButton>
          <OptButton onClick={() => handleZoomButtonMouseDown(true)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="12"
                fill={buttonColor}
                fillOpacity="0.1"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.25 12.5V15.75H12.75V12.5H16V11H12.75V7.75H11.25V11H8V12.5H11.25Z"
                fill={buttonColor}
              />
            </svg>
          </OptButton>
          <OptButton onClick={() => handleDragButtonMouseDown(false)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="12"
                fill={buttonColor}
                fillOpacity="0.1"
              />
              <path
                d="M10.0575 7.77734L9 8.83484L12.435 12.2773L9 15.7198L10.0575 16.7773L14.5575 12.2773L10.0575 7.77734Z"
                fill={buttonColor}
              />
            </svg>
          </OptButton>
        </div>
      </div>

      {placeholder}
    </>
  );
}

export default DepthChartV2;
