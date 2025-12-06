'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ParentMessage({ open }: { open: boolean }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)

    if (open) {
      const timer = setTimeout(() => setIsOpen(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute top-4 left-4 z-50"
        >
          <div className="bg-white shadow-lg rounded-2xl px-4 py-2 w-[90vw] max-w-lg border">
            <h2 className="text-primary-700 font-bold text-xl">
              {t('parentMessage.dearParents')}
            </h2>
            <p className="text-gray-700 mt-1">{t('parentMessage.subtitle')}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
