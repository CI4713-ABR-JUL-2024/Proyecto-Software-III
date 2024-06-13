import React, { forwardRef, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

type ProjectsProps = {
  project: string[];
};

export const PrintProject = React.forwardRef<HTMLDivElement, ProjectsProps>((props, ref) => {
    return (
        <div ref={ref}>
            <h1>Proyectos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Descripción</th>
                        <th>Inicio</th>
                        <th>Cierre</th>
                    </tr>
                </thead>
                <tbody>
                    {props.project.map((project, index) => (
                        <tr key={index}>
                            <td>{project[0]}</td>
                            <td>{project[1]}</td>
                            <td>{project[2]}</td>
                            <td>{project[3]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

});
