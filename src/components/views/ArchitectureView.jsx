import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Zap,
  Server,
  Boxes,
  FileCode2,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { MODULE_DOMAINS } from '../../data/allModules';

export const ArchitectureView = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const principles = [
    {
      icon: Layers,
      title: 'Modular Monolith',
      description: '100 isolated business modules with strict domain boundaries. No direct model manipulation across boundaries — all cross-module data access via Service Contracts and DTOs.',
      color: 'white'
    },
    {
      icon: ShieldCheck,
      title: 'RBAC & Sanctum Auth',
      description: 'Granular permission system with role hierarchies. Laravel Sanctum bearer tokens for stateless API authentication with rate limiting per token.',
      color: 'white'
    },
    {
      icon: Zap,
      title: 'Event-Driven Async',
      description: 'Domain events dispatched on all state mutations. Queued listeners powered by Redis/Horizon for non-blocking cross-module side effects.',
      color: 'white'
    },
    {
      icon: Server,
      title: 'Dual Backend Architecture',
      description: 'Laravel 11.x (PHP 8.3 / Eloquent) for modular monolith. Node.js Express (MERN Stack / Mongoose) for MongoDB-native workloads.',
      color: 'white'
    },
    {
      icon: Boxes,
      title: '10 Core Domains',
      description: 'Identity, Social, Communication, Commerce, Financial, Booking, Gaming, Marketing, Intelligence, and Operations — each containing 10 cohesive modules.',
      color: 'white'
    },
    {
      icon: FileCode2,
      title: '15-Step Engineering Checklist',
      description: 'Every module passes a 15-step compliance checklist: directory structure, schema, models, services, controllers, tests, and documentation.',
      color: 'white'
    }
  ];

  return (
    <>
      <style>{`
        .arch-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; padding-top: 1.5rem; padding-bottom: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
        .arch-header { padding-bottom: 0.75rem; border-bottom: 1px solid #27272a; }
        .arch-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .arch-title-icon { width: 1.25rem; height: 1.25rem; color: #fff; }
        .arch-subtitle { font-size: 0.75rem; color: #a1a1aa; margin-top: 0.125rem; }
        .arch-grid-3 { display: grid; gap: 1rem; }
        .arch-principle-card { background-color: #09090b; border: 1px solid #27272a; border-radius: 0.75rem; padding: 1.25rem; transition: border-color 0.2s; }
        .arch-principle-card:hover { border-color: #52525b; }
        .arch-principle-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .arch-principle-icon-box { height: 2.25rem; width: 2.25rem; border-radius: 0.5rem; background-color: #18181b; border: 1px solid #3f3f46; display: flex; align-items: center; justify-content: center; }
        .arch-principle-icon { width: 1rem; height: 1rem; color: #fff; }
        .arch-principle-title { font-size: 0.875rem; font-weight: 700; color: #fff; }
        .arch-principle-desc { font-size: 0.75rem; color: #a1a1aa; line-height: 1.625; }
        .arch-boundary-card { background-color: #000; border: 1px solid #27272a; border-radius: 0.75rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .arch-boundary-title { font-size: 0.875rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .arch-boundary-title-icon { width: 1rem; height: 1rem; color: #fff; }
        .arch-rule-card { padding: 0.75rem; background-color: #09090b; border-radius: 0.5rem; border: 1px solid #27272a; }
        .arch-rule-title { font-size: 0.75rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
        .arch-rule-desc { font-size: 11px; color: #a1a1aa; line-height: 1.625; }
        .arch-domains-title { font-size: 0.875rem; font-weight: 700; color: #fff; margin-bottom: 1rem; }
        .arch-domain-card { background-color: #09090b; border: 1px solid #27272a; border-radius: 0.5rem; padding: 0.75rem; text-align: center; transition: border-color 0.2s; }
        .arch-domain-card:hover { border-color: #52525b; }
        .arch-domain-range { font-size: 10px; color: #71717a; font-family: monospace; margin-bottom: 0.25rem; }
        .arch-domain-name { font-size: 0.75rem; font-weight: 700; color: #fff; }
        .arch-domain-count { font-size: 10px; color: #a1a1aa; margin-top: 0.25rem; }
        .arch-tech-card { background-color: #09090b; border: 1px solid #27272a; border-radius: 0.75rem; padding: 1.5rem; }
        .arch-tech-title { font-size: 0.875rem; font-weight: 700; color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .arch-tech-title-icon { width: 1rem; height: 1rem; color: #fff; }
        .arch-tech-grid { display: grid; gap: 0.75rem; font-size: 0.75rem; }
        .arch-tech-item { padding: 0.625rem; background-color: #000; border-radius: 0.5rem; border: 1px solid #27272a; }
        .arch-tech-label { font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
        .arch-tech-value { font-family: monospace; font-weight: 600; color: #fff; }
        @media (min-width: 1024px) { .arch-container { padding-left: 2rem; padding-right: 2rem; } .arch-grid-3 { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 640px) { .arch-container { padding-left: 1.5rem; padding-right: 1.5rem; } .arch-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 640px) { .arch-rule-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 640px) { .arch-domains-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .arch-domains-grid { grid-template-columns: repeat(5, 1fr); } }
        @media (min-width: 640px) { .arch-tech-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
      <div className="arch-container">
        {/* Header */}
        <div className="arch-header">
          <h2 className="arch-title">
            <Cpu className="arch-title-icon" />
            System Architecture & Design Rules
          </h2>
          <p className="arch-subtitle">
            Strict modular monolith patterns, cross-module communication rules, and enterprise compliance standards.
          </p>
        </div>

        {/* Architecture Principles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="arch-grid-3"
        >
          {principles.map((p, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="arch-principle-card"
            >
              <div className="arch-principle-header">
                <div className="arch-principle-icon-box">
                  <p.icon className="arch-principle-icon" />
                </div>
                <h3 className="arch-principle-title">{p.title}</h3>
              </div>
              <p className="arch-principle-desc">{p.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Module Boundary Rules */}
        <div className="arch-boundary-card">
          <h3 className="arch-boundary-title">
            <ShieldCheck className="arch-boundary-title-icon" />
            Module Boundary Rules
          </h3>
          <div className="arch-rule-grid" style={{ display: 'grid', gap: '1rem' }}>
            {[
              { rule: 'No Direct Model Manipulation', desc: "Module A must never query ModuleB's models directly. Use Service Contracts and DTOs." },
              { rule: 'Asynchronous Event Bus', desc: 'State changes dispatch Domain Events. Listeners react via queued jobs powered by Redis.' },
              { rule: 'Database Independence', desc: 'Foreign keys use indexed big integers. Cascading rules managed at service level for extraction readiness.' },
              { rule: 'Service Contract Injection', desc: 'Module services bound to container interfaces. Cross-module calls via injected service contracts only.' }
            ].map((item, idx) => (
              <div key={idx} className="arch-rule-card">
                <div className="arch-rule-title">{item.rule}</div>
                <div className="arch-rule-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Domains Grid */}
        <div>
          <h3 className="arch-domains-title">10 Core Business Domains</h3>
          <div className="arch-domains-grid" style={{ display: 'grid', gap: '0.75rem' }}>
            {MODULE_DOMAINS.slice(0, 10).map((domain) => (
              <div
                key={domain.id}
                className="arch-domain-card"
              >
                <div className="arch-domain-range">Modules {domain.range}</div>
                <div className="arch-domain-name">{domain.name}</div>
                <div className="arch-domain-count">{domain.count} modules</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="arch-tech-card">
          <h3 className="arch-tech-title">
            <Server className="arch-tech-title-icon" />
            Technology Stack
          </h3>
          <div className="arch-tech-grid">
            {[
              { label: 'Backend A', value: 'Laravel 11.x / PHP 8.3' },
              { label: 'Backend B', value: 'Node.js 20+ / Express' },
              { label: 'Database A', value: 'MySQL 8.0 InnoDB' },
              { label: 'Database B', value: 'MongoDB 7.0' },
              { label: 'Auth', value: 'Sanctum + JWT' },
              { label: 'Queue', value: 'Redis / Horizon' },
              { label: 'Frontend', value: 'React 19' },
              { label: 'Styling', value: 'Internal CSS' }
            ].map((t, idx) => (
              <div key={idx} className="arch-tech-item">
                <div className="arch-tech-label">{t.label}</div>
                <div className="arch-tech-value">{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
