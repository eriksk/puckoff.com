
#magick '*.png' -resize 20% '%f_thumbnail.png'


directory = `pwd`;
images = Dir["**/*.png"]

images.each{ |image|
    if !image.include?("thumbnail")
        
        absolutePath = (directory + "/" + File.dirname(image) + "/" + File.basename(image)).gsub("\n", "")
        targetPath = "#{absolutePath[0..-5]}_thumbnail.png"
        puts "Converting '#{absolutePath}' to '#{targetPath}'"

        # Remove old file first or imagemagick will increment on filename
        if File.exist?(targetPath)
            File.delete(targetPath)
        end

        `magick '#{absolutePath}' -resize 20% -blur 14 '#{targetPath}'`
    else
        puts "Skipping #{image}"
    end
}
