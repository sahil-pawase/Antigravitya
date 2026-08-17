"use client";

import React from "react";
import { Modal } from "@/ui/Modal";
import { LeadForm } from "./LeadForm";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function BookDemoModal({ isOpen, onClose, source = "NAVBAR_POPUP" }: BookDemoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book a Free 1-on-1 Career & Curriculum Demo"
      description="Connect with an experienced Data Analytics mentor. Walk through the curriculum, explore live projects, and get your doubts answered."
      maxWidth="xl"
    >
      <LeadForm onSuccess={onClose} source={source} buttonText="Confirm Free Demo Booking" />
    </Modal>
  );
}
