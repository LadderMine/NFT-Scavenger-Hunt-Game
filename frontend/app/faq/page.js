<div className="space-y-8">
            {/* Quick Connect */}
            <Card className="backdrop-blur-lg bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Quick Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href="mailto:support@nftscavenger.com"
                  className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-6 h-6 text-purple-400 mr-4" />
                  <div>
                    <h3 className="text-white font-medium">Email Support</h3>
                    <p className="text-gray-300 text-sm">
                      support@nftscavenger.com
                    </p>
                  </div>
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-purple-400 mr-4" />
                  <div>
                    <h3 className="text-white font-medium">
                      Discord Community
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Join our active community
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="backdrop-blur-lg bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-white">Twitter</span>
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-white">GitHub</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="backdrop-blur-lg bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300 space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM UTC</p>
                  <p>Weekend: 10:00 AM - 4:00 PM UTC</p>
                  <p className="text-sm mt-4">
                    We strive to respond to all inquiries within 24 hours during
                    business hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>