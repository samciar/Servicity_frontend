import React from 'react'
import servicityLogo from '../assets/servicity_logo.png'
import { Link } from 'react-router'

export default function Building() {
    return (
        <>
            <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5">
                <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-300 p-2 ">
                    <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700">
                        <div className="flex justify-end">
                            <img src={servicityLogo} className="mb-11.5 h-6 " alt="logo Servicity" />
                        </div>
                        <div className="space-y-6">
                            <p>Proyecto en construcción</p>
                            <p>Caracteristicas futuras de Servicity:</p>
                            <ul className="space-y-3">
                                <li className="flex">
                                    <svg className="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" strokeLinecap="square">
                                        <circle cx="11" cy="11" r="11" className="fill-amber-600/25" />
                                        <circle cx="11" cy="11" r="10.5" className="stroke-amber-600/25" />
                                        <path d="M8 11.5L10.5 14L14 8" className="stroke-amber-600 " />
                                    </svg>
                                    <p className="ml-3">Registro como ofertante de servicios</p>
                                </li>
                                <li className="flex">
                                    <svg className="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" strokeLinecap="square">
                                        <circle cx="11" cy="11" r="11" className="fill-amber-600/25" />
                                        <circle cx="11" cy="11" r="10.5" className="stroke-amber-600/25" />
                                        <path d="M8 11.5L10.5 14L14 8" className="stroke-amber-600 " />
                                    </svg>
                                    <p className="ml-3">Busqueda de servicios ofertados</p>
                                </li>
                                <li className="flex">
                                    <svg className="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" strokeLinecap="square">
                                        <circle cx="11" cy="11" r="11" className="fill-amber-600/25" />
                                        <circle cx="11" cy="11" r="10.5" className="stroke-amber-600/25" />
                                        <path d="M8 11.5L10.5 14L14 8" className="stroke-amber-600 " />
                                    </svg>
                                    <p className="ml-3">Agendamiendo de tareas solicitadas</p>
                                </li>
                                <li className="flex">
                                    <svg className="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" strokeLinecap="square">
                                        <circle cx="11" cy="11" r="11" className="fill-amber-600/25" />
                                        <circle cx="11" cy="11" r="10.5" className="stroke-amber-600/25" />
                                        <path d="M8 11.5L10.5 14L14 8" className="stroke-amber-600 " />
                                    </svg>
                                    <p className="ml-3">Pagos en linea sin salir de su casa</p>
                                </li>
                            </ul>
                            <p>No tendrá que preocuparse por no tener conocimiento o herramienta para realizar alguna tarea en su hogar / negocio.</p>
                        </div>
                        <hr className="my-6 w-full border-(--pattern-fg)" />
                        <p className="mb-3">¿Desea ver una previsualización de la página de bienvenida?</p>
                        <p className="font-semibold">
                            <Link to="/Home" className="text-gray-950 underline decoration-amber-600 underline-offset-3 hover:decoration-2">Visitar página de bienvenida</Link>
                            {/* <a href="home" className="text-gray-950 underline decoration-amber-600 underline-offset-3 hover:decoration-2">Visitar página de bienvenida</a> */}
                        </p>
                    </div>
                </div>
                <div className="relative -right-px col-start-2 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
                <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
                <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)"></div>
                <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)"></div>
            </div>
        </>
    )
}
