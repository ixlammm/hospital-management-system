"use client"

import { useState } from "react"
import { Check, Globe, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n, locales, type Locale } from "@/lib/i18n"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SettingsTab() {
  const { t, locale, setLocale } = useI18n()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  const getLanguageName = (locale: Locale) => {
    switch (locale) {
      case "en":
        return t("common.english")
      case "fr":
        return t("common.french")
      default:
        return locale
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h2>
        <p className="text-muted-foreground">{t("settings.general")}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t("settings.general")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("settings.appearance")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
          <TabsTrigger value="security">{t("settings.security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.languageSettings")}</CardTitle>
              <CardDescription>{t("settings.selectLanguage")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{t("settings.language")}</p>
                    <p className="text-sm text-muted-foreground">{getLanguageName(locale)}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{getLanguageName(locale)}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {locales.map((l) => (
                      <DropdownMenuItem
                        key={l}
                        onClick={() => setLocale(l)}
                        className="flex items-center justify-between"
                      >
                        {getLanguageName(l)}
                        {locale === l && <Check className="h-4 w-4 ml-2" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button>{t("settings.saveChanges")}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.theme")}</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5" />
                  ) : theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <div className="flex">
                      <Sun className="h-5 w-5" />
                      <Moon className="h-5 w-5 ml-1" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{t("settings.theme")}</p>
                    <p className="text-sm text-muted-foreground">
                      {theme === "light"
                        ? t("settings.lightMode")
                        : theme === "dark"
                          ? t("settings.darkMode")
                          : t("settings.systemDefault")}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {theme === "light"
                        ? t("settings.lightMode")
                        : theme === "dark"
                          ? t("settings.darkMode")
                          : t("settings.systemDefault")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
                      {t("settings.lightMode")}
                      {theme === "light" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
                      {t("settings.darkMode")}
                      {theme === "dark" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between">
                      {t("settings.systemDefault")}
                      {theme === "system" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications")}</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings will be added here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.security")}</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Security settings will be added here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

