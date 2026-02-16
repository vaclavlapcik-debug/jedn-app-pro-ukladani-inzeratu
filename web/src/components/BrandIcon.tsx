import React from 'react';
import type { FunctionComponent, SVGProps } from 'react';

interface BrandIconProps extends React.HTMLAttributes<HTMLDivElement> {
    component: FunctionComponent<SVGProps<SVGSVGElement>>;
    accentColor: string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ component: SvgComponent, accentColor, className, style, ...props }) => {
    return (
        <div
            className={`brand-icon ${className || ''}`}
            style={{ '--brand-color': accentColor, ...style } as React.CSSProperties}
            {...props}
        >
            <SvgComponent className="brand-svg-content" />
        </div>
    );
};
