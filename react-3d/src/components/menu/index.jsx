import React, { useRef, PointerEvent, useState } from "react";

export function Menu(params) {
    return (
        <body>
            <header class="header">
                <button class="menu-icon-btn">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </header>
            <div class="container">
                <aside class="sidebar">
                    <div class="top-sidebar">
                        <a href="#" class="channel-logo"><i class="fa-solid fa-bars"></i></a>
                    </div>
                    <div class="middle-sidebar">
                        <ul class="sidebar-list">
                            <li class="sidebar-list-item active">
                            </li>
                        </ul>
                    </div>
                    <div class="bottom-sidebar">
                        <ul class="sidebar-list">
                            <li class="sidebar-list-item">
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </body>
    )
}