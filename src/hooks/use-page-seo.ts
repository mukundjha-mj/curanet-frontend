import { useEffect } from "react"

type SeoConfig = {
  path: string
  title: string
  description: string
  jsonLdId: string
  jsonLd: Record<string, unknown>
  ogImagePath?: string
  ogImageAlt?: string
}

export function usePageSeo({
  path,
  title,
  description,
  jsonLdId,
  jsonLd,
  ogImagePath = "/CuraNet.png",
  ogImageAlt,
}: SeoConfig) {
  useEffect(() => {
    const previousTitle = document.title
    const pageUrl = `${window.location.origin}${path}`
    const ogImageUrl = `${window.location.origin}${ogImagePath}`

    const trackedNodes: Array<{
      type: "meta" | "link"
      node: HTMLMetaElement | HTMLLinkElement
      existed: boolean
      previousContent: string | null
    }> = []

    const upsertMeta = (attr: "name" | "property", value: string, content: string) => {
      const selector = `meta[${attr}="${value}"]`
      const existingNode = document.head.querySelector(selector) as HTMLMetaElement | null
      const node = existingNode ?? document.createElement("meta")
      const existed = Boolean(existingNode)
      const previousContent = existed ? node.getAttribute("content") : null

      node.setAttribute(attr, value)
      node.setAttribute("content", content)

      if (!existed) {
        document.head.appendChild(node)
      }

      trackedNodes.push({
        type: "meta",
        node,
        existed,
        previousContent,
      })
    }

    const upsertCanonical = (href: string) => {
      const selector = 'link[rel="canonical"]'
      const existingNode = document.head.querySelector(selector) as HTMLLinkElement | null
      const node = existingNode ?? document.createElement("link")
      const existed = Boolean(existingNode)
      const previousContent = existed ? node.getAttribute("href") : null

      node.setAttribute("rel", "canonical")
      node.setAttribute("href", href)

      if (!existed) {
        document.head.appendChild(node)
      }

      trackedNodes.push({
        type: "link",
        node,
        existed,
        previousContent,
      })
    }

    const existingJsonLd = document.getElementById(jsonLdId) as HTMLScriptElement | null
    const previousJsonLdContent = existingJsonLd?.textContent ?? null
    const jsonLdScript = existingJsonLd ?? document.createElement("script")
    const createdJsonLdScript = !existingJsonLd

    document.title = title

    upsertMeta("name", "description", description)
    upsertMeta("property", "og:type", "website")
    upsertMeta("property", "og:site_name", "CuraNet")
    upsertMeta("property", "og:title", title)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:url", pageUrl)
    upsertMeta("property", "og:image", ogImageUrl)
    if (ogImagePath.endsWith(".svg")) {
      upsertMeta("property", "og:image:type", "image/svg+xml")
    }
    if (ogImageAlt) {
      upsertMeta("property", "og:image:alt", ogImageAlt)
    }
    upsertMeta("name", "twitter:card", "summary_large_image")
    upsertMeta("name", "twitter:title", title)
    upsertMeta("name", "twitter:description", description)
    upsertMeta("name", "twitter:image", ogImageUrl)
    if (ogImageAlt) {
      upsertMeta("name", "twitter:image:alt", ogImageAlt)
    }
    upsertCanonical(pageUrl)

    jsonLdScript.id = jsonLdId
    jsonLdScript.type = "application/ld+json"
    jsonLdScript.textContent = JSON.stringify(jsonLd)

    if (createdJsonLdScript) {
      document.head.appendChild(jsonLdScript)
    }

    return () => {
      document.title = previousTitle

      for (const entry of trackedNodes) {
        if (!entry.existed) {
          entry.node.remove()
          continue
        }

        if (entry.type === "meta") {
          if (entry.previousContent !== null) {
            ;(entry.node as HTMLMetaElement).setAttribute("content", entry.previousContent)
          }
        }

        if (entry.type === "link") {
          if (entry.previousContent !== null) {
            ;(entry.node as HTMLLinkElement).setAttribute("href", entry.previousContent)
          }
        }
      }

      if (createdJsonLdScript) {
        jsonLdScript.remove()
      } else if (previousJsonLdContent !== null) {
        jsonLdScript.textContent = previousJsonLdContent
      }
    }
  }, [description, jsonLd, jsonLdId, ogImagePath, path, title])
}
