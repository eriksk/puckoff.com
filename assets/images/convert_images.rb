
## DOCS
# Clean: convert_images.rb -clean
# Create images: convert_images.rb

directory = `pwd`;
images = Dir["**/*.png"]

clean = false

ARGV.each do |p|
    if p == "-clean"
        clean = true
    end
end

if clean
    puts "Cleaning up"
    cleaned_files = 0
    file_name_includes = ["_thumbnail", "_medium", "_md", "_sm"]
    images.each do |image|
        file_name_includes.each do |type|
            if image.include?(type)
                puts "Deleting: #{image}"
                File.delete(image)
                cleaned_files += 1
            end
        end
    end

    puts "Done cleanup, removed: #{cleaned_files}"
    return
end

images.each{ |image|
    if !image.include?("_sm") && !image.include?("_md")
        
        absolutePath = (directory + "/" + File.dirname(image) + "/" + File.basename(image)).gsub("\n", "")
        absolutePath_without_file_ending = absolutePath.gsub(/.png/, "")

        target_thumb_path = "#{absolutePath_without_file_ending}_sm.png"
        target_medium_path = "#{absolutePath_without_file_ending}_md.png"

        puts "Converting '#{absolutePath}'"

        # Remove old file first or imagemagick will increment on filename
        if File.exist?(target_thumb_path)
            File.delete(target_thumb_path)
        end
        if File.exist?(target_medium_path)
            File.delete(target_medium_path)
        end
        
        `magick '#{absolutePath}' -resize 20% -blur 14 '#{target_thumb_path}'`
        `magick '#{absolutePath}' -resize 50% '#{target_medium_path}'`
    else
        puts "Skipping #{image}"
    end
}
