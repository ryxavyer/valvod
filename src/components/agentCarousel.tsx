"use client"
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@src/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel"
import { AGENTS, agentToRole, roleToJSX } from '@src/lib/valorant';


const AgentCarousel = () => {
    const sortedAgents = [...AGENTS].sort((a, b) => b.vod_importance - a.vod_importance);
    return (
        <div className="hidden max-w-[85%] mx-auto py-4 md:block">
            <Carousel opts={{ align: 'start', loop: true, slidesToScroll: 4 }} className="overflow-visible">
                <CarouselContent className="-ml-1 overflow-visible">
                    {sortedAgents.map((agent) => (
                        <CarouselItem
                            key={agent.value}
                            className="h-full rounded-lg overflow-visible pl-1 basis-1/4"
                        >
                            <div className="p-1 overflow-visible">
                                <Card
                                    style={{ backgroundColor: agent.bg_hex }}
                                    className="border-none overflow-visible"
                                >
                                    <Link
                                        href={`/search/?q=${agent.value}`}
                                        className="flex flex-row items-center justify-between pr-4"
                                    >
                                        <CardContent
                                            className="
                                                relative
                                                aspect-video
                                                w-24
                                                overflow-visible
                                                pointer-events-auto
                                            "
                                        >
                                            <img
                                                src={agent.icon_small}
                                                alt={agent.name}
                                                className="
                                                    absolute inset-0
                                                    w-full h-full object-cover
                                                    overflow-visible
                                                    pointer-events-none
                                                "
                                            />
                                        </CardContent>
                                        <span style={{ fill: agent.role_hex }}>{roleToJSX(agentToRole(agent.value), 'h-8 w-8 shrink-0 opacity-100')}</span>
                                    </Link>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

export default AgentCarousel;
