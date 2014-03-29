module DungeonTracker
  module Helpers
    include FuzzyTimeHelper

    def authenticated?
      return !session[:user].nil?
    end

    def current_user
      if session[:user].nil?
        return nil
      else
        return User.find(session[:user])
      end
    end

    def title
      if !@title.nil? && !@title.empty?
        "| #{@title}"
      else
        ""
      end
    end

    # http://api.rubyonrails.org/classes/ActionView/Helpers/NumberHelper.html
    def nice_num num
      if num < 20
        I18n.with_locale(:en) { num.to_words }
      else
        ActionView::Base.new.number_to_human num
      end
    end

    # http://api.rubyonrails.org/classes/ActionView/Helpers/TextHelper.html#method-i-pluralize
    def pluralize cnt, word
      ActionView::Base.new.pluralize(cnt, word).split(' ').last
    end

    def mod number
      val = (number.to_i - 10) / 2
      val = "+#{val}" if val >= 0

      val
    end

    def mkd text
      markdown = Redcarpet::Markdown.new(
        Redcarpet::Render::HTML,
        autolink: true,
        tables: true,
        no_intra_emphasis: true,
        strikethrough: true,
        fenced_code_blocks: true)

      markdown.render(text.to_s)
    end
  end
end

DungeonTracker::App.helpers DungeonTracker::Helpers
